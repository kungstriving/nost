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
	
	/**
	 * session中的page容器key定义 sepages
	 */
	public static final String SEN_K_PAGES = "sepages";
	
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
	
	/***************************************************************
	 * 错误消息key定义
	 ****************************************************************/
	
	/**
	 * session 画面为空
	 */
	public static final String EC_SESSION_PAGE_NULL = "10000";
	
	/**
	 * 页面刷新错误 10001
	 */
	public static final String EC_REFRESH_ERROR = "10001";
	
	/****************************************************************
	 * 消息key定义
	 *****************************************************************/
	
	/**
	 * 操作正常 1000
	 */
	public static final String IC_OK = "1000";
	
	/*****************************************************************
	 * others
	 ****************************************************************/
	
	/**
	 * front seperator  _
	 */
	public static final String FACE_SEPERATOR = "_";
	
}
