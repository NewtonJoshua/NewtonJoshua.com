package com.newtonjoshua;

import java.io.IOException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.google.appengine.labs.repackaged.org.json.JSONObject;

@SuppressWarnings("serial")
public class Feeds_servlet extends HttpServlet {
	@Override
	public void doGet(HttpServletRequest req, HttpServletResponse resp) throws IOException {
		JSONObject result = null;

		try {
			result = Feeds.getFeeds(req.getParameter("url"));
		} catch (Exception e) {

			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        System.out.println(result);
		resp.addHeader("Access-Control-Allow-Origin", "*");
		resp.setContentType("application/json");
		resp.getWriter().println(result);
	}

}
