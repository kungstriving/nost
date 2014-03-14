package com.everhope.nost.face;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

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
		logger.info("register page " + pageName);
		logger.info("register done");
	}

}
