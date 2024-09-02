export default {
    "tabs": [
        {
            "value": "main",
            "editable": true,
            "sections": [
                {
                    "value": "general",
                    "editable": true,
                    "columns": [
                        {
                            "value": "name",
                            "fields": [
                                "name",
                                "description",
                                "subdomain",
                                "domain"
                            ]
                        },
                        {
                            "value": "information",
                            "fields": [
                                "salesRep",
                                "currencies",
                                "languages",
                                "paymentMethods",
                                "deliveryMethods"
                            ]
                        },
                        {
                            "value": "communication",
                            "fields": [
                                "message",
                                "email",
                                "phone"
                            ]
                        },
                        {
                            "value": "classification",
                            "fields": [
                                "category",
                                "group"
                            ]
                        }
                    ]
                },
                {
                    "value": "options",
                    "editable": true,
                    "columns": [
                        {
                            "value": "config",
                            "fields": [
                                "loginRequired",
                                "phoneRequired",
                                "allowBackorder",
                                "taxRate"
                            ]
                        },

                    ]
                }
            ]
        },
        {
            "value": "addresses",
            "editable": true,
            "sections": [
                {
                    "value": "address",
                    "editable": true,
                    "subdoc": "address",
                    "columns": [
                        {
                            "value": "name",
                            "fields": [
                                "name",
                                "addressee"
                            ]
                        },
                        {
                            "value": "details",
                            "fields": [
                                "address",
                                "address2"
                            ]
                        },
                        {
                            "value": "",
                            "fields": [
                                "city",
                                "zip",
                                "country"
                            ]
                        },
                        {
                            "value": "contact",
                            "fields": [
                                "email",
                                "phone"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "value": "seo",
            "editable": true,
            "sections": [
                {
                    "value": "Meta Tags",
                    "editable": true,
                    "columns": [
                        {
                            "value": "general",
                            "fields": [
                                "metaTitle",
                                "metaDescription",
                                "metaKeywords"
                            ]
                        },
                        {
                            "value": "google",
                            "fields": [
                                "GSC"
                            ]
                        },
                        {
                            "value": "secialmedia",
                            "fields": [
                                "ogTitle",
                                "ogDescription",
                                "ogUrl",
                                "ogImage"
                            ]
                        }
                    ]
                }
            ]
        },
        {
            "value": "template",
            "editable": true,
            "sections": [
                {
                    "value": "template",
                    "editable": true,
                    "columns": [
                        {
                            "value": "",
                            "fields": [
                                "template",
                                "logo",
                                "image",
                                "favicon"
                            ]
                        },
                        {
                            "value": "colors",
                            "fields": [
                                "colorPrimary",
                                "colorSecondary",
                                "colorAccent"
                            ]
                        },
                        {
                            "value": "socialmedia",
                            "fields": [
                                "facebookUrl",
                                "twitterUrl",
                                "instagramUrl",
                                "linkedinUrl"
                            ]
                        }
                    ]
                },
                {
                    "value": "cms",
                    "editable": true,
                    "fields": [
                    ],
                    "tables": [{
                        "value": "pages",
                        "subdoc": "pages",
                        "columns": [
                            {
                                "value": "main",
                                "fields": [
                                    "name",
                                    "description",
                                    "pageType",
                                    "urlComponent",
                                ]
                            },
                            {
                                "value": "meta",
                                "fields": [
                                    "metaTitle",
                                    "metaDescription",
                                    "metaKeywords"
                                ]
                            },
                            {
                                "value": "other",
                                "fields": [
                                    "html",
                                    "template",
                                    "image",
                                    "languages"
                                ]
                            },
                        ]
                    }]
                },
                {
                    "value": "emailTriggers",
                    "editable": true,
                    "fields": [
                    ],
                    "tables": [{
                        "value": "emailTriggers",
                        "subdoc": "emailTriggers",
                        "columns": [
                            {
                                "value": "main",
                                "fields": [
                                    "template",
                                    "language",
                                    "trigger"
                                ]
                            },
                            {
                                "value": "other",
                                "fields": [
                                    "email",
                                    "cc",
                                    "bcc",
                                    "replyTo"
                                ]
                            },
                        ]
                    }]
                }
            ]
        },
        {
            "value": "analysis",
            "editable": false,
            "sections": [
                {
                    "value": "statistics",
                    "editable": false,
                    "component": "CustomerStatistics"
                },
                {
                    "value": "topitems",
                    "editable": false,
                    "component": "CustomerTopItems"
                }
            ]
        },
        {
            "value": "systeminformation",
            "editable": false,
            "sections": [
                {
                    "value": "changelogs",
                    "editable": false,
                    "component": "ChangeLogs"
                }
            ]
        }
    ]
}