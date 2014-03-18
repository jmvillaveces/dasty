package uk.ac.ebi.dasty;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.InetSocketAddress;
import java.net.Proxy;
import java.net.URL;
import java.util.Enumeration;
import java.util.Map;

/**
 * @author Bruno Aranda (baranda@ebi.ac.uk)
 * @version $Id$
 */
public class Dasty3ProxyServlet extends HttpServlet {

    /**
     * Default timeout for connection is 3 seconds
     */
    private static final int DEFAULT_TIMEOUT = 10;

    /**
     * If using a proxy, the name the host
     */
    private String proxyHost = null;

    /**
     * if using a proxy, the port number
     */
    private Integer proxyPort = null;

    /**
     * Stores the DAS status codes
     */
    private Map<Integer, String> dasStatusCodes;

    @Override
    public void init(ServletConfig config) throws ServletException {
        this.proxyHost = System.getProperty("proxyHost", null);
        String portValue = System.getProperty("proxyPort", null);

        if (portValue != null) {
            proxyPort = Integer.valueOf(portValue);
        }
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpURLConnection connection = createConnection(req);

        connectAndWriteResponse(resp, connection);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpURLConnection connection = createConnection(req);

        System.out.println("POST: " + connection.getURL());

        connection.addRequestProperty("_content", req.getParameter("_content"));

        copyHeaders(req, resp);

        connectAndWriteResponse(resp, connection);
     }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
          HttpURLConnection connection = createConnection(req);

         System.out.println("PUT: "+connection.getURL());

        copyHeaders(req, resp);

        connectAndWriteResponse(resp, connection, req.getParameter("_content"));
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
         HttpURLConnection connection = createConnection(req);

         System.out.println("DELETE: " + connection.getURL());

         copyHeaders(req, resp);

        connectAndWriteResponse(resp, connection);

    }

    private HttpURLConnection createConnection(HttpServletRequest req) throws IOException {
        String urlParam = req.getParameter("url");

        URL url = new URL(urlParam);

        HttpURLConnection connection;

        if (proxyHost != null) {
            connection = (HttpURLConnection) url.openConnection(new Proxy(Proxy.Type.HTTP, new InetSocketAddress(proxyHost, proxyPort)));
        } else {
            connection = (HttpURLConnection) url.openConnection();
        }

        connection.setConnectTimeout(DEFAULT_TIMEOUT * 1000);
        connection.setReadTimeout(DEFAULT_TIMEOUT * 1000);
        connection.setUseCaches(false);
        connection.setDoInput(true);
        connection.setDoOutput(true);

        connection.setRequestMethod(req.getMethod());

        return connection;
    }

    private void connectAndWriteResponse(HttpServletResponse resp, HttpURLConnection connection) throws ServletException {
        connectAndWriteResponse(resp, connection, null);
    }

     private void connectAndWriteResponse(HttpServletResponse resp, HttpURLConnection connection, String urlParameters) throws ServletException {
        try {
           InputStream stream;

            if (urlParameters == null) {
                stream = connect(connection);
            } else {
                stream = connect(connection, urlParameters);
            }
           writeResponse(resp, stream);

        } catch (Exception e) {
            throw new ServletException("Problem connecting to: "+connection.getURL(), e);
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
        }
    }

     private InputStream connect(HttpURLConnection connection) throws IOException {
        InputStream stream = null;

            connection.connect();
            stream = connection.getInputStream();

        return stream;
    }

     private InputStream connect(HttpURLConnection connection, String urlParameters) throws IOException {
        InputStream stream = null;

         DataOutputStream wr = new DataOutputStream(
                 connection.getOutputStream());
         wr.writeBytes(urlParameters);
         wr.flush();
         wr.close();

         return connection.getInputStream();
     }

    private void writeResponse(HttpServletResponse resp, InputStream input) throws ServletException {
        try {
            BufferedReader in = new BufferedReader(new InputStreamReader(input));
            String line;
            while ((line = in.readLine()) != null) {
                final String lineStr = line + System.getProperty("line.separator");
                resp.getWriter().write(lineStr);
            }
            in.close();
        } catch (IOException e) {
            throw new ServletException(e);
        }
    }

    private void copyHeaders(HttpServletRequest req, HttpServletResponse resp) {
        final Enumeration headerNames = req.getHeaderNames();

        while (headerNames.hasMoreElements()) {
            String headerName = (String) headerNames.nextElement();
            String headerValue = req.getHeader(headerName);

            resp.addHeader(headerName, headerValue);
        }
    }


}
