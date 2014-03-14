package com.everhope.nost.face;
/**
 * 
 * @author kongxiaoyang
 * @date 2014年3月9日 下午1:16:25 
 * @version V1.0 
 */
public class FaceConstants {

	/******************************************************
	 * context keys definition
	 ******************************************************/
	
	/**
	 * context中的pages=Map<String, Page>
	 */
	public static final String CTX_K_PAGES = "pages";
	
	/************************************************************
	 * request url keys definition
	 ************************************************************/
	
	/**
	 * request url data key for action : action
	 */
	public static final String REQ_K_ACTIONS = "action";
	
	/**
	 * page name key : pageName
	 */
	public static final String REQ_K_PAGENAME = "pageName";
	
	/**
	 * tags key in url : tags
	 */
	public static final String REQ_K_TAGS = "tags";
	
	/**
	 * page refresh time flag
	 */
	public static final String REQ_K_REFFLAG = "refreshFlag";
	
	/***************************************************************
	 * request key enum definition
	 *****************************************************************/
	
	/**
	 * request action type-register
	 */
	public static final String REQ_ACTION_REGISTER = "register";
	
	/**
	 * request action type-refresh
	 */
	public static final String REQ_ACTION_REFRESH = "refresh";
	
	/*****************************************************************
	 * others
	 ****************************************************************/
	
	/**
	 * front seperator  _
	 */
	public static final String FACE_SEPERATOR = "_";
	
}
