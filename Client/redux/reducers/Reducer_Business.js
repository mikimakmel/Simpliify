import { actionsTypes } from '../actions/Actions_Business';

const initialState = {
    currentBusiness: {
        "businessDetails": {
            "business": {
                "businessid": "44",
                "address": "44",
                "manager": "264",
                "name": "Moen, Kihn and Funk",
                "category": "Food",
                "phone": "0524498984",
                "website": "https://moenkihnandfunk.com",
                "description": "Front-line encompassing budgetary management",
                "dailycounter": 1,
                "avatar": "https://robohash.org/autoptioiste.jpg?size=80x80&set=set1",
                "addressid": "44",
                "street": "98 Rabbi Akiva",
                "city": "Bnei Brak",
                "country": "Israel",
                "coordinates": {
                    "x": 32.087265,
                    "y": 34.8285151
                },
                "rating": "3.7",
                "ratingcount": "6"
            },
            "tags": [
                {
                    "businessid": "44",
                    "tag": "Electrician"
                },
                {
                    "businessid": "44",
                    "tag": "Exterminator"
                },
                {
                    "businessid": "44",
                    "tag": "Vegeterian"
                }
            ],
            "availability": [
                {
                    "businessid": "44",
                    "dow": "Sunday",
                    "starttime": "10:00:00",
                    "endtime": "16:00:00"
                },
                {
                    "businessid": "44",
                    "dow": "Monday",
                    "starttime": "12:00:00",
                    "endtime": "16:00:00"
                },
                {
                    "businessid": "44",
                    "dow": "Friday",
                    "starttime": "09:00:00",
                    "endtime": "17:00:00"
                },
                {
                    "businessid": "44",
                    "dow": "Thursday",
                    "starttime": "08:00:00",
                    "endtime": "19:00:00"
                },
                {
                    "businessid": "44",
                    "dow": "Wednesday",
                    "starttime": "12:00:00",
                    "endtime": "19:00:00"
                },
                {
                    "businessid": "44",
                    "dow": "Tuesday",
                    "starttime": "08:00:00",
                    "endtime": "19:00:00"
                },
                {
                    "businessid": "44",
                    "dow": "Saturday",
                    "starttime": "09:00:00",
                    "endtime": "16:00:00"
                }
            ],
            "services": [
                {
                    "serviceid": "44",
                    "businessid": "44",
                    "name": "Tools Business Development",
                    "price": 125,
                    "durationminutes": 60,
                    "qouta": 2
                },
                {
                    "serviceid": "210",
                    "businessid": "44",
                    "name": "Tools Training",
                    "price": 175,
                    "durationminutes": 60,
                    "qouta": 4
                },
                {
                    "serviceid": "376",
                    "businessid": "44",
                    "name": "Music Marketing",
                    "price": 75,
                    "durationminutes": 30,
                    "qouta": 5
                },
                {
                    "serviceid": "542",
                    "businessid": "44",
                    "name": "Kids Services",
                    "price": 175,
                    "durationminutes": 60,
                    "qouta": 8
                },
                {
                    "serviceid": "708",
                    "businessid": "44",
                    "name": "Automotive Human Resources",
                    "price": 50,
                    "durationminutes": 90,
                    "qouta": 3
                },
                {
                    "serviceid": "874",
                    "businessid": "44",
                    "name": "Health Legal",
                    "price": 175,
                    "durationminutes": 60,
                    "qouta": 5
                }
            ],
            "reviews": [],
            "photos": {
                "cover": {
                    "businessid": "44",
                    "imagelink": "https://www.usnews.com/dims4/USNEWS/fcef005/2147483647/crop/2000x1313%2B0%2B2/resize/640x420/quality/85/?url=http%3A%2F%2Fcom-usnews-beam-media.s3.amazonaws.com%2F01%2F22%2Fdd00e94f4f769dee5ab9820f3db3%2F170727-hairstylist-stock.jpg"
                },
                "carousel": [
                    {
                        "businessid": "44",
                        "imagelink": "https://www.usnews.com/dims4/USNEWS/fcef005/2147483647/crop/2000x1313%2B0%2B2/resize/640x420/quality/85/?url=http%3A%2F%2Fcom-usnews-beam-media.s3.amazonaws.com%2F01%2F22%2Fdd00e94f4f769dee5ab9820f3db3%2F170727-hairstylist-stock.jpg"
                    },
                    {
                        "businessid": "44",
                        "imagelink": "https://twincutz.com/wp-content/uploads/2018/02/AT3A3824.jpg"
                    },
                    {
                        "businessid": "44",
                        "imagelink": "https://www.mensjournal.com/wp-content/uploads/2018/04/properbarbershop.jpg?w=900"
                    },
                    {
                        "businessid": "44",
                        "imagelink": "https://www.gentsbarber.shop/wp-content/uploads/2018/10/local-barber-shop-gents-classic-barbershop-menomonee-falls-wisconsin-haircuts-scissors-tools.jpg"
                    },
                    {
                        "businessid": "44",
                        "imagelink": "http://mr-sweeneytodd.com/wp-content/uploads/2014/09/home1.jpg"
                    },
                    {
                        "businessid": "44",
                        "imagelink": "http://justinsbarbershop.com/wp-content/uploads/2015/11/barbertools1080.jpg"
                    }
                ]
            }
        }
    }
}

const BusinessReducer = (state = initialState, action) => {
    switch (action.type) {

        case actionsTypes.UPDATE_CURRENT_BUSINESS: {
            return {
                ...state,
                currentBusiness: action.data
            }
        }

        default: {
            return state
        }

    }
}

export default BusinessReducer;