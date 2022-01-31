import _ from 'lodash';
import mysql, { OkPacket, QueryOptions, RowDataPacket } from 'mysql2/promise';
import { INSERT_BIKE_SQL, GET_BIKE_SQL } from '../../../database/bike';
import pool from '../../../database/pool';

export const mockQuery = jest.spyOn(pool, 'query').mockImplementation((sql : QueryOptions, values: any) : Promise<any> => {
    console.log(sql.sql);
    switch(sql.sql){
        case GET_BIKE_SQL:{
            switch(values[0]){
                case 18:{
                    return Promise.resolve([[{
                        bike_id: 18,
                        year: '1996',
                        make: 'Honda',
                        model: 'WR450F',
                        membership_admin: 'Addia Shipway',
                    }]]);
                }
                case 765:{
                    return Promise.resolve([[]]);
                }
                case -100:{
                    throw new Error('error message')
                }
                default:{
                    return Promise.resolve();
                }
            }
        }
        case INSERT_BIKE_SQL:{
            switch(values[0]){
                case '-100':{
                    throw new Error('error message');
                }
                case '2010':{
                    return Promise.resolve([{insertId: 321}]);
                }
                default:{
                    return Promise.resolve();
                }
            }
        }
    default:{
        return Promise.resolve();
    }
    
}});


//     }
//     switch(values[0]){
//         case 18:{
//             return Promise.resolve([[{
//                 bike_id: 18,
//                 year: '1996',
//                 make: 'Honda',
//                 model: 'WR450F',
//                 membership_admin: 'Addia Shipway',
//             }]]);
//         }
//         case 765:{
//             return Promise.resolve([[]]);
//         }
//         case -100:{
//             throw new Error('error message')
//         }
//         default:{
//             return Promise.resolve();
//         }
//     }
// });


// export const mockInsertQuery = jest.spyOn(pool, 'query').mockImplementation((sql : QueryOptions, values: any) : Promise<any> => {
//     switch(values[0]){
//         case '-100':{
//             throw new Error('error message');
//         }
//         case '2010':{
//             return Promise.resolve([{insertId: 321}]);
//         }
//         default:{
//             return Promise.resolve();
//         }
//     }
// });