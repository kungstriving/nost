package com.everhope.nost.models;
/**
 * Tag definition
 * @author kongxiaoyang
 * @date 2014年3月9日 下午1:05:35 
 * @version V1.0 
 */
public class Tag {

	private String userPart;
	private String ds;
	private String tagName;
	private String value;
	private String quality;
	
	public String getUserPart() {
		return userPart;
	}
	public void setUserPart(String userPart) {
		this.userPart = userPart;
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
	public String getValue() {
		return value;
	}
	public void setValue(String value) {
		this.value = value;
	}
	public String getQuality() {
		return quality;
	}
	public void setQuality(String quality) {
		this.quality = quality;
	}
	
	public Tag(String userPart, String ds, String tagName, String value,
			String quality) {
		super();
		this.userPart = userPart;
		this.ds = ds;
		this.tagName = tagName;
		this.value = value;
		this.quality = quality;
	}
	
	
}
