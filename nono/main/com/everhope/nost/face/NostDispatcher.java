package com.everhope.nost.face;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

/**
 * main dispatcher
 */
@WebServlet("/nost")
public class NostDispatcher extends HttpServlet {
       
    /**
	 * 
	 */
	private static final long serialVersionUID = 6487309972038551486L;

	private static final Logger logger = Logger.getLogger(NostDispatcher.class);
	
	/**
     * @see HttpServlet#HttpServlet()
     */
    public NostDispatcher() {
        super();
        logger.info("create NostDispatcher");
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
	protected void doPost(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		logger.info(String.format("dispatch request @ %s", request.getSession().getId()));
		
		String action = request.getParameter(FaceConstants.REQ_K_ACTIONS);
		RequestDispatcher dispatcher = null;
		if (action == null) {
			return;
		}
		switch (action) {
		case FaceConstants.REQ_ACTION_REGISTER:
			//dispatch to register service
			dispatcher = request.getRequestDispatcher("/register");
			
			break;
		case FaceConstants.REQ_ACTION_REFRESH:
			dispatcher = request.getRequestDispatcher("/refresh");
			break;
		default:
			dispatcher = request.getRequestDispatcher("/error.html");
			break;
		}
		
		dispatcher.forward(request, response);
		logger.info("dispatch done");
	}

}
