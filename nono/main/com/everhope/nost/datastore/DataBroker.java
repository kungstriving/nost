package com.everhope.nost.datastore;

import java.util.Random;

import com.everhope.nost.models.Page;

/**
 * Data broker for db
 * @author kongxiaoyang
 * @date 2014年3月9日 下午9:15:25 
 * @version V1.0 
 */
public class DataBroker {

	private static DataBroker singleInstance = null;
	
	private DataBroker() {}
	
	public static DataBroker getInstance() {
		if (singleInstance == null) {
			singleInstance = new DataBroker();
		}
		return singleInstance;
	}
	
	public String refreshPage(Page page) {
		Random rand = new Random();
		int r = rand.nextInt(100);
		return "{\"rand\":" + r + "}";
	}
}
