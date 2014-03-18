package uk.ac.ebi.dasty;

import org.mortbay.jetty.Connector;
import org.mortbay.jetty.Server;
import org.mortbay.jetty.nio.SelectChannelConnector;
import org.mortbay.jetty.servlet.Context;
import org.mortbay.jetty.servlet.ServletHolder;

/**
 * @author Bruno Aranda (baranda@ebi.ac.uk)
 * @version $Id$
 */
public class ProxyServer {

    public static void main(String[] args) throws Exception{
        int port = 80;

        if (args.length > 0) {
            port = Integer.parseInt(args[0]);
        }

        String portEnv = System.getProperty("dasty.proxy.port");

        if (portEnv != null) {
            port = Integer.valueOf(portEnv);
        }

        Server server = new Server();

        Connector connector=new SelectChannelConnector();
        connector.setPort(port);
        server.setConnectors(new Connector[]{connector});

        Context root = new Context(server,"/proxy",Context.SESSIONS);
        root.addServlet(new ServletHolder(new Dasty2ProxyServlet()), "/dasty2");
        root.addServlet(new ServletHolder(new Dasty3ProxyServlet()), "/dasty3");

        server.start();
    }

}
