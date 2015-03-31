<table cellpadding='10' align='left' border='0'>
<blockquote><tr>
<blockquote><td valign='top'>
<table cellpadding='0' width='540px' align='left' border='0'>
</blockquote><tr>
<blockquote><td>
Dasty is a web client for visualizing protein sequence feature information using <a href='http://www.biodas.org/'>DAS</a>. Through the <a href='http://www.dasregistry.org/'>DAS registry</a> the client establishes connections to a DAS reference server to retrieve sequence information and to one or more DAS annotation servers to retrieve feature annotations. It merges the collected data from all these servers and provides the user with a unified, aesthetically pleasing, effective view of the sequence-annotated features. Dasty uses AJAX to deliver highly interactive graphical functionality in a web browser by executing multiple asynchronous DAS requests.</blockquote></blockquote>

Technically, Dasty is web-browser compatible, lightweight, independent from third party software, easy to integrate into other web based systems, efficient when loading and manipulating annotations, highly configurable and customizable, and interactive and intuitive for users. By being web-based, it is more readily accessible to biological researchers, as they do not need to install specialized software to run it. Being JavaScript-based, it is easy for developers to integrate it into their own web systems. Customizability aids this. The use of AJAX improves efficiency when displaying information. Finally, because of its independence from large, complicated third-party libraries and its modularity, Dasty is easy to extend.<br>
<br>
Visually, Dasty provides numerous advantages over other DAS clients. Space is used effectively so there is no need to scroll in portions of the screen. It makes use of the standard colours employed by Uniprot and SRS for annotations. Dasty uses colours, borders, complimentary shades and separating lines to contrast features with the background and to make the relationships among annotations clear. Finally, Dasty allows grouping and sorting of annotations by various properties, and zooming within a protein sequence.<br>
<br>
Dasty3 is based on a plug-in architecture. It emphasises extendibility, plug-in customisation, and interoperability –e.g. data exchange amongst plug-ins. The architecture also makes it easy for developers to integrate Dasty3 into existing Web applications as well as to configure the look-and-feel by defining customised templates.<br>
<blockquote></td>
</blockquote><blockquote></tr></blockquote>

<blockquote><tr>
<blockquote><td align='center'>
<i>Fig 1. Dasty3 architecture</i>
<a href='http://dasty.googlecode.com/svn/wiki/dasty3_figure_paper.PNG'>http://dasty.googlecode.com/svn/wiki/dasty3_figure_paper.PNG</a>
</blockquote><blockquote></td>
</blockquote></tr></blockquote>

<blockquote><tr>
<blockquote><td>
As illustrated in Fig 1, Dasty3 brings together several components that can be accessed by using the API. <a href='http://code.google.com/p/jsdas/'>JSDAS</a> is being used as a bridge between the framework and DAS servers; it automatically generates JavaScript objects representing, in concordance with the DAS 1.6 specification, the DAS responses. The framework has five major components, namely: (i) the Model, defining the DAS objects according to the <a href='http://www.biodas.org/wiki/DAS1.6'>DAS 1.6 specification</a>; (ii) the Controller, managing the retrieval, organization and storage of the data; (iii) the Plug-in Manager, making it possible to load plug-ins; (iv) the Event Manager, managing and triggering events so that plug-ins can communicate with each other; and, (v) the Template Manager, rendering the plug-ins in the available area according to the selected template. Plug-ins are components that extend the capabilities of the framework by delivering a particular functionality. They are defined as a tightly-coupled and dynamic collection of JavaScript and CSS files. Templates add flexibility to the Graphic User Interface (GUI) by simplifying the display of plug-ins and customization the layout. For instance, moving and reorganising plug-ins according to end user preferences can be defined in a template.<br>
</blockquote><blockquote></td>
</blockquote></tr>
</table></blockquote>

</td>
<td align='left' valign='top'>
<i>Fig 2. Dasty3 screenshot</i>
<img src='http://dasty.googlecode.com/svn/wiki/Dasty3_2011-03-09_small2.png' />
</td>
</tr>
</table>


