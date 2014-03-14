package com.everhope.nost.models;
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
	
	public String getUserPart() {
		return tenant;
	}
	public void setUserPart(String userPart) {
		this.tenant = userPart;
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
