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
                            "value": "main",
                            "fields": [
                                "entity",
                                "date",
                                "referenceNumber"
                            ]
                        },
                        {
                            "value": "classification",
                            "fields": [
                                "company",
                                "group",
                                "category",
                                "salesRep"
                            ]
                        },
                        {
                            "value": "other",
                            "fields": [
                                "memo",
                                "shippingCost",
                                "promoCode",
                                "shop"
                            ]
                        },
                        // {
                        //     "value": "lines",
                        //     "fields": [
                        //         "lines"
                        //     ]
                        // }
                    ],
                    "tables": [{
                        "value": "lines",
                        "subdoc": "lines",
                        "columns": [
                            {
                                "value": "Item",
                                "fields": [
                                    "item",
                                    "description",
                                ]
                            },
                            {
                                "value": "Quantity",
                                "fields": [
                                    "quantity",
                                    "price",
                                ]
                            },
                            {
                                "value": "Other",
                                "fields": [
                                    "eta",
                                    "taxRate",
                                ]
                            },
                        ],
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
                            }
                        ]
                    }]
                }
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
                            "value": "tax",
                            "fields": [
                                "taxRate",
                                "taxNumber",
                            ]
                        },
                        {
                            "value": "payment",
                            "fields": [
                                "currency",
                                "terms",
                                "paymentMethod"
                            ]
                        }


                    ]
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