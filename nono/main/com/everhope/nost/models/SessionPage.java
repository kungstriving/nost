package com.everhope.nost.models;
/**
 * 
 * @author kongxiaoyang
 * @date 2014年3月14日 下午4:13:18 
 * @version V1.0 
 */
public class SessionPage {

	private int updateFlag = 0;
	
	private Page ctxPage = null;
	
	public SessionPage(Page page) {
		this.ctxPage = page;
	}
	
	public int getUpdateFlag() {
		return this.updateFlag;
	}
	
	public void setUpdateFlag(int pUpdateFlag) {
		this.updateFlag = pUpdateFlag;
	}
	
	public String update() {
		return "";
	}
}
