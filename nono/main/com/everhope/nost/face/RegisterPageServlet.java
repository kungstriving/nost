package com.everhope.nost.face;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.everhope.nost.models.Tag;
import com.google.gson.Gson;

/**
 * Servlet implementation class RegisterPageServlet
 */
@WebServlet("/register")
public class RegisterPageServlet extends HttpServlet {
       
    /**
	 * 
	 */
	private static final long serialVersionUID = 6473804317047526877L;

	private static final Logger logger = Logger.getLogger(RegisterPageServlet.class);
	
	/**
     * @see HttpServlet#HttpServlet()
     */
    public RegisterPageServlet() {
        super();
        logger.info("create register servlet");
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		logger.info(String.format("register page @ %s", request.getSession().getId()));
		
		String pageName = request.getParameter(FaceConstants.REQ_K_PAGENAME);
		String tagsJson = request.getParameter(FaceConstants.REQ_K_TAGS);
		
		if (logger.isDebugEnabled()) {
			logger.info("register page " + pageName);
		}
		
		//resolve the tags
		List<Tag> regTags = resolveTags(tagsJson);
		
		//check if the system already load this page
//		PageContainer<Page> container = 
//				(PageContainer<Page>)getServletContext().getAttribute(FaceConstants.CTX_K_PAGES);
//		Page page = container.getByName(pageName);
		
		logger.info("register done");
	}
	
	private List<Tag> resolveTags(String tagsJson) {
		Gson gson = new Gson();
		List<String> tagNames = gson.fromJson(tagsJson, RegisterTags.class).tags;
		
		List<Tag> pageTags = new ArrayList<>();
		
		for (String tagStr : tagNames) {
			
			if (!tagStr.contains(FaceConstants.FACE_SEPERATOR)) {
				continue;
			}
			
			String[] tagsPart = tagStr.split(FaceConstants.FACE_SEPERATOR);
			if (tagsPart == null || tagsPart.length < 3) {
				logger.warn(String.format("Resolve Tag[%s] name rror", tagStr));
				continue;
			}
			
			Tag tmp = new Tag();
			tmp.setUserPart(tagsPart[0]);
			tmp.setDs(tagsPart[1]);	//设置数据源名称
			tmp.setTagName(tagsPart[2]);	//设置tag名称
			
			pageTags.add(tmp);
		}
		
		return pageTags;
	}
	
	class RegisterTags {
		public List<String> tags;
	}

}
