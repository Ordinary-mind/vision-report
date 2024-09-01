const data = {
    "name": "sheet2",
    "freeze": "A1",
    "styles": [
        {
            "border": {
                "bottom": [
                    "thin",
                    "#000"
                ],
                "top": [
                    "thin",
                    "#000"
                ],
                "left": [
                    "thin",
                    "#000"
                ],
                "right": [
                    "thin",
                    "#000"
                ]
            }
        },
        {
            "border": {
                "bottom": [
                    "thin",
                    "#000"
                ],
                "top": [
                    "thin",
                    "#000"
                ],
                "left": [
                    "thin",
                    "#000"
                ],
                "right": [
                    "thin",
                    "#000"
                ]
            },
            "bgcolor": "#d8d8d8"
        },
        {
            "format": "percent"
        },
        {
            "format": "datetime"
        },
        {
            "format": "date"
        },
        {
            "format": "text"
        },
        {
            "format": "normal"
        },
        {
            "align": "center"
        },
        {
            "align": "center",
            "font": {
                "size": 12
            }
        },
        {
            "align": "center",
            "font": {
                "size": 14
            }
        }
    ],
    "merges": [
        "A1:C1"
    ],
    "rows": {
        "0": {
            "cells": {
                "0": {
                    "merge": [
                        0,
                        2
                    ],
                    "text": "统计报表",
                    "style": 9
                },
                "1": {
                    "style": 9
                },
                "2": {
                    "style": 9
                }
            },
            "height": 41
        },
        "1": {
            "cells": {
                "0": {
                    "text": "日期",
                    "style": 1
                },
                "1": {
                    "text": "姓名",
                    "style": 1
                },
                "2": {
                    "text": "地址",
                    "style": 1
                }
            }
        },
        "2": {
            "cells": {
                "0": {
                    "style": 0,
                    "text": "#{dataset1.date}"
                },
                "1": {
                    "style": 0,
                    "text": "#{dataset1.name}"
                },
                "2": {
                    "style": 0,
                    "text": "#{dataset1.address}"
                }
            }
        },
        "3": {
            "cells": {
                "0": {
                    "style": 6
                }
            }
        },
        "4": {
            "cells": {
                "0": {}
            }
        },
        "5": {
            "cells": {
                "0": {},
                "3": {}
            }
        },
        "6": {
            "cells": {
                "0": {}
            }
        },
        "7": {
            "cells": {
                "0": {}
            }
        },
        "len": 101
    },
    "cols": {
        "0": {
            "width": 120
        },
        "1": {
            "width": 149
        },
        "2": {
            "width": 152
        },
        "len": 26
    },
    "validations": [],
    "autofilter": {}
}
export default data