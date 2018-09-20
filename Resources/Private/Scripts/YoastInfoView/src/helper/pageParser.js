export default class PageParser {
    constructor(documentContent) {
        this.parser = new DOMParser();
        const parsedPreviewDocument = this.parser.parseFromString(documentContent, "text/html");

        this.metaSection = parsedPreviewDocument.querySelector('head');

        // Remove problematic tags for the Yoast plugin from preview document
        let scriptTags = parsedPreviewDocument.querySelectorAll('script,svg');
        scriptTags.forEach((scriptTag) => {
            scriptTag.remove();
        });

        this.locale = (parsedPreviewDocument.querySelector('html').getAttribute('lang') || 'en_US').replace('-', '_');

        this.pageContent = parsedPreviewDocument.querySelector('body').innerHTML;
        // Remove problematic data attributes for the Yoast plugin from preview document
        const re = /data-.*?=".*?"/gim;
        this.pageContent = this.pageContent.replace(re, '');
    }

    get title() {
        return this.metaSection.querySelector('title') ? this.metaSection.querySelector('title').textContent : '';
    }

    get description() {
        return this.metaSection.querySelector('meta[name="description"]') ? this.metaSection.querySelector('meta[name="description"]').getAttribute('content') : '';
    }
}