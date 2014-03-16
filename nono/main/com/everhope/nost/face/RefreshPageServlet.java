package com.everhope.nost.face;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.everhope.nost.models.SessionPage;

/**
 * Servlet implementation class RefreshPageServlet
 */
@WebServlet("/refresh")
public class RefreshPageServlet extends HttpServlet {
    /**
	 * 
	 */
	private static final long serialVersionUID = -5809478464452228334L;
	
	private static final Logger logger = Logger.getLogger(RefreshPageServlet.class);

	/**
     * @see HttpServlet#HttpServlet()
     */
    public RefreshPageServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * 
	 */
	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		logger.info("refreshing page @ " + request.getSession().getId());
		
		String pageName = request.getParameter(FaceConstants.REQ_K_PAGENAME);
		String refreshFlag = request.getParameter(FaceConstants.REQ_K_REFFLAG);
		
		Map<String, SessionPage> pageMap = (Map<String,SessionPage>)
				request.getSession().getAttribute(FaceConstants.SEN_K_PAGES);
		SessionPage page = pageMap.get(pageName);
		page.setUpdateFlag(Integer.parseInt(refreshFlag));
		
		String refreshData = page.update();
		logger.info("refresh page done");
		response.getWriter().write(refreshData);
	}

}
