package com.everhope.nost.models;

import com.everhope.nost.datastore.StoreConstants;

/**
 * Tag definition
 * @author kongxiaoyang
 * @date 2014年3月9日 下午1:05:35 
 * @version V1.0 
 */
public class Tag {

	private String tenant;
	private String ds;
	private String tagName;
	
	/**
	 * 获取DB中的tag 点表示 DS_TagName
	 * @return
	 */
	public String getDBTagName() {
		return this.ds + StoreConstants.PDE_SEPERATOR + this.tagName;
	}
	
	public String getTenant() {
		return tenant;
	}
	public void setTenant(String tenant) {
		this.tenant = tenant;
	}
	public String getDs() {
		return ds;
	}
	public void setDs(String ds) {
		this.ds = ds;
	}
	public String getTagName() {
		return tagName;
	}
	public void setTagName(String tagName) {
		this.tagName = tagName;
	}
	
	public Tag() {}
	
	public Tag(String userPart, String ds, String tagName) {
		super();
		this.tenant = userPart;
		this.ds = ds;
		this.tagName = tagName;
	}
	
	
}
