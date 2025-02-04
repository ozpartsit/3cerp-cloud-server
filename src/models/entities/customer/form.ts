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
                                "firstName",
                                "lastName"
                            ]
                        },
                        {
                            "value": "information",
                            "fields": [
                                "website",
                                "memo",
                                "lastActivity"
                            ]
                        },
                        {
                            "value": "communication",
                            "fields": [
                                "email",
                                "email2",
                                "phone",
                                "phone2"
                            ]
                        },
                        {
                            "value": "classification",
                            "fields": [
                                "category",
                                "group",
                                "salesRep"
                            ]
                        }
                    ]
                },
                {
                    "value": "contacts",
                    "editable": true,
                    "fields": [],
                    "tables": [{
                        "value": "contacts",
                        "subdoc": "contacts",
                        "columns": [
                            {
                                "value": "main",
                                "fields": [
                                    "firstName",
                                    "lastName",
                                    "name"
                                ]
                            },
                            {
                                "value": "contact",
                                "fields": [
                                    "phone",
                                    "email",
                                ]
                            },
                            {
                                "value": "other",
                                "fields": [
                                    "jobTitle",
                                    "description",
                                ]
                            },
                        ]
                    }]
                }
            ]
        },
        {
            "value": "addresses",
            "editable": true,
            "sections": [
                {
                    "value": "billingAddress",
                    "editable": true,
                    "subdoc": "billingAddress",
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
                },
                {
                    "value": "shippingAddress",
                    "editable": true,
                    "subdoc": "shippingAddress",
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
                },
                {
                    "value": "addressbook",
                    "editable": true,
                    "fields": [
                    ],
                    "tables": [{
                        "value": "addresses",
                        "subdoc": "addresses",
                        "columns": [
                            {
                                "value": "main",
                                "fields": [
                                    "name",
                                    "addressee",

                                ]
                            },
                            {
                                "value": "Address",
                                "fields": [
                                    "address",
                                    "address2",
                                ]
                            },
                            {
                                "value": "",
                                "fields": [
                                    "city",
                                    "zip",
                                    "country",
                                ]
                            },
                            {
                                "value": "contact",
                                "fields": [
                                    "phone",
                                    "email",
                                ]
                            },
                            {
                                "value": "default",
                                "fields": [
                                    "billingAddress",
                                    "shippingAddress",
                                ]
                            },
                        ]
                    }]
                }
            ]
        },
        {
            "value": "sales",
            "editable": true,
            "sections": [
                {
                    "value": "openOrders",
                    "editable": false,
                    "component": "OpenOrders"
                },
                {
                    "value": "relatedTransactions",
                    "editable": false,
                    "component": "RelatedTransactions"
                },
                {
                    "value": "favoriteItems",
                    "editable": true,
                    "tables": [{
                        "value": "favoriteItems",
                        "subdoc": "favoriteItems",
                        "columns": [
                            {
                                "value": "item",
                                "fields": [
                                    "item",
                                    "description",
                                ]
                            },
                           
                        ],
                    }]
                },
            ]
        },
        {
            "value": "financial",
            "editable": true,
            "sections": [
                {
                    "value": "accounting",
                    "editable": true,
                    "columns": [
                        {
                            "value": "",
                            "fields": [
                                "accountOnHold",
                                "taxRate",
                                "taxNumber"
                            ]
                        },
                        {
                            "value": "",
                            "fields": [
                                "currency",
                                "terms",
                                "paymentMethod",
                                "creditLimit"
                            ]
                        },
                        {
                            "value": "",
                            "fields": [
                                "firstSalesDate",
                                "lastSalesDate",
                                "firstOrderDate",
                                "lastOrderDate"
                            ]
                        }
                    ]
                },
                {
                    "value": "statement",
                    "editable": false,
                    "component": "statement"
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
            "value": "communication",
            "editable": false,
            "sections": [
                {
                    "value": "notes",
                    "editable": false,
                    "component": "Notes"
                },
                {
                    "value": "emails",
                    "editable": false,
                    "component": "Emails"
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