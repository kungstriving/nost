package com.everhope.nost.face;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;

import com.everhope.nost.models.User;

/**
 * 加载画面实现
 */
@WebServlet("/loadPage")
public class LoadPageServlet extends HttpServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 2567317191488244187L;
	
	private static final Logger logger = Logger.getLogger(LoadPageServlet.class);
	
    /**
     * 
     */
    public LoadPageServlet() {
        super();
    }

	/**
	 * 
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * 处理用户访问页面的请求
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		HttpSession session = request.getSession();
		
		//获取用户
		User user = (User)session.getAttribute(FaceConstants.SEN_K_USER);
		//获取到要访问的画面
		String pageName = request.getParameter(FaceConstants.REQ_K_PAGENAME);
		String pageAbsPath = request.getServletContext().getRealPath("/pages/" + pageName);
		//首先解析是否有访问该画面的权限
		user.accessToPage(pageAbsPath);
		response.sendRedirect(request.getServletContext().getContextPath() + "/pages/" + pageName + "/");
		String s = "<html><head><link rel='stylesheet' href='./pages/login/login.css' /></head><body><h1>TTTTT</h1></body></html>";
		response.getWriter().write(s);
		response.getWriter().flush();
		return;
	}

}
