package com.everhope.nost.face;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.FileFilterUtils;
import org.apache.log4j.Logger;

import com.everhope.nost.models.Page;
import com.google.gson.Gson;

/**
 * page load listener
 * This listener will load all the ready pages
 *
 */
@WebListener
public class PageLoadListener implements ServletContextListener {

	private static final Logger logger = Logger.getLogger(PageLoadListener.class);
	
    /**
     * Default constructor. 
     */
    public PageLoadListener() {
    	logger.info("PageLoadListener()");
    }

	/**
	 * init to load the pages
     * @see ServletContextListener#contextInitialized(ServletContextEvent)
     */
    public void contextInitialized(ServletContextEvent ctxEve) {
    	logger.info("start load pages");
    	Map<String, Page> pageMap = new HashMap<String, Page>();
    	
    	//look for all the pages
    	ServletContext context = ctxEve.getServletContext();
    	context.setAttribute(FaceConstants.CTX_K_PAGES, pageMap);
    	
    	String pagesPath = context.getRealPath("/pages");
    	File[] dirs = new File(pagesPath).listFiles((FileFilter)FileFilterUtils.directoryFileFilter());
    	for (File pageDir : dirs) {
			//only the directoris
    		File pageJson = new File(pageDir.getAbsolutePath() + "/" + pageDir.getName() + ".server.json");
    		try {
				String fileContent = FileUtils.readFileToString(pageJson);
				//
				Gson gson = new Gson();
				Page page = gson.fromJson(fileContent, Page.class);
				pageMap.put(page.getPageName(), page);
			} catch (IOException e) {
				logger.error(e.getMessage());
				logger.error("load pages error, system exit!");
				throw new RuntimeException(e);
			}
		}
    	logger.info("end load pages");
    }

	/**
     * @see ServletContextListener#contextDestroyed(ServletContextEvent)
     */
    public void contextDestroyed(ServletContextEvent arg0) {
        // TODO Auto-generated method stub
    }
	
}
