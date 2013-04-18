/**
 * Extends default formatter.
 */
Contextly.SnippetWidgetBlocksFormatter = Contextly.createClass({
    extend: Contextly.SnippetWidgetBlocksFormatter,

    getLinkHTML: function ( link ) {
        var html = "<li><a href=\"" + link.native_url + "\" onmousedown=\"this.href='" + link.url + "'\" onclick=\"javascript:return(true)\">";

        if ( link.thumbnail_url ) {
            html += "<img src='" + link.thumbnail_url + "' />";
        }
        html += "<p><span>" + link.title + "</span></p>";
        html += "</a><!--[if lte ie 7]><b></b><![endif]--></li>";

        return html;
    },

    loadCss: function() {
        Contextly.Utils.getInstance().loadCssFile( 'http://localhost/contextly/wp-content/plugins/contextly-linker/templates/the-next-web/template-the-next-web.css' );
    }
});