package com.everhope.nost.datastore;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ResourceBundle;

import org.apache.commons.lang.math.NumberUtils;
import org.apache.log4j.Logger;

import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import redis.clients.jedis.JedisPoolConfig;
import redis.clients.jedis.Pipeline;
import redis.clients.jedis.Response;

import com.everhope.nost.models.SessionPage;
import com.everhope.nost.models.Tag;

/**
 * Data broker for db
 * @author kongxiaoyang
 * @date 2014年3月9日 下午9:15:25 
 * @version V1.0 
 */
public class DataBroker {

	private static final Logger logger = Logger.getLogger(DataBroker.class);
	
	private static DataBroker singleInstance = null;
	private final JedisPool jedisPool;
	private String auth;
	private Map<String, String> funcTable = new HashMap<>();
	
	/**
	 * 获取单例对象
	 * @return
	 */
	public static DataBroker getInstance() {
		if (singleInstance == null) {
			singleInstance = new DataBroker();
		}
		return singleInstance;
	}
	
	private DataBroker() {
		//读取配置文件
		ResourceBundle bundle = ResourceBundle.getBundle("nostconf");
		String host = bundle.getString("db_host");
		int port = Integer.parseInt(bundle.getString("db_port"));
		auth = bundle.getString("db_auth");
		JedisPoolConfig poolConfig = new JedisPoolConfig();
		String maxTotal = bundle.getString("db_actives");
		poolConfig.setMaxTotal(NumberUtils.toInt(maxTotal));
		jedisPool = new JedisPool(poolConfig, host, port);
	}
	
	/**
	 * 加载初始脚本
	 * @param initScripts
	 */
	public void loadScripts() throws Exception{
		Jedis jedis = null;
		try {
			jedis = jedisPool.getResource();
			jedis.auth(auth);
			String shaFuncKey = jedis.scriptLoad(StoreConstants.SCRIPT_GETKEYS_LAGER_TIMEFLAG);
			funcTable.put(StoreConstants.SCRIPTKEY_GETKEYS_LAGER_TIMEFLAG, shaFuncKey);
		} catch (Exception e) {
			throw e;
		} finally {
			if (jedis != null) {
				jedisPool.returnResource(jedis);
			}
		}
	}
	
	/**
	 * 根据点名称从数据库获取该点的valueMap
	 * @param dbPointNames
	 * @return
	 */
	private Map<String, Map<String, String>> getLatestValue(List<String> dbPointNames)
			throws Exception{
		if (logger.isDebugEnabled()) {
			logger.debug("get points value");
		}
		//key=tagname,value=taghash
		Map<String, Map<String, String>> mapTmp = new HashMap<>();
		Jedis jedis = null;
		
		try {
			jedis = jedisPool.getResource();
			jedis.auth(auth);
			
			//遍历所有数据点获取值
			Pipeline pipe = jedis.pipelined();
			Map<String, Response<Map<String, String>>> map = new HashMap<>();
			for(String pointName : dbPointNames) {
				map.put(pointName, pipe.hgetAll(pointName));
			}
			
			pipe.sync();
			
			for (Map.Entry<String, Response<Map<String, String>>> entry : map.entrySet()) {
				mapTmp.put(entry.getKey(), entry.getValue().get());
			}
			
		} catch (Exception e) {
			throw e;
		} finally {
			if (jedis != null) {
				jedisPool.returnResource(jedis);
			}
		}
		
		if (logger.isDebugEnabled()) {
			logger.debug("get points value end");
		}
		return mapTmp;
	}
	
	/**
	 * 更新画面
	 * @param page
	 * @return Map[key=tagname, value = taghash]
	 */
	public Map<String, Map<String, String>> refreshPage(SessionPage page) throws Exception{
		if (logger.isDebugEnabled()) {
			logger.debug("refreshing");
		}
		//抽取所有点名称，这些点名称可以在DB中找到
		List<Tag> tagList = page.getTags();
		List<String> tagNames = new ArrayList<>();
		for (Tag tag : tagList) {
			tagNames.add(tag.getDBTagName());
		}

		//获取timeflag满足条件的keys
		List<String> resultKeys = exeScriptLargerTime(tagNames, page.getUpdateFlag() + "");
		//获取最新数据
		Map<String, Map<String, String>> values = getLatestValue(resultKeys);
		
		if (logger.isDebugEnabled()) {
			logger.debug("refreshing end");
		}
		
		return values;
	}
	
	/**
	 * 执行数据库脚本，取出所有时间标识大于timeFlag的key
	 * 
	 * @param dbPointNames
	 * @param timeFlag
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private List<String> exeScriptLargerTime(List<String> dbPointNames, String timeFlag) throws Exception{
		
		logger.info("execute script [timeflag = " + timeFlag + "]");
		
		//执行redis函数
		List<String> resultKeys = new ArrayList<>();
		Jedis jedis = null;
		try {
			String funcKey = funcTable.get(StoreConstants.SCRIPTKEY_GETKEYS_LAGER_TIMEFLAG);
			jedis = jedisPool.getResource();
			jedis.auth(auth);
			
			List<String> args = new ArrayList<>();
			args.add(timeFlag);
			
			resultKeys = (List<String>)jedis.evalsha(funcKey, dbPointNames, args);
		} catch (Exception e) {
			throw e;
		} finally {
			if (jedis != null) {
				jedisPool.returnResource(jedis);
			}
		}
		logger.info("return keys size " + resultKeys.size());
		return resultKeys;
	}
	
	/**
	 * 销毁连接器
	 */
	public void close() {
		if (jedisPool != null) {
			jedisPool.destroy();
		}
		logger.info("close connection");
	}
}
