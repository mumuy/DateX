import {periodKey,periodMap} from './config/period';

export default function(datex,proto){

    Object.assign(proto,{
        toDate(){
            return this._date;
        },
        toObject(){
            let D = this._date;
            return {
                'year':D.getFullYear(),
                'month':D.getMonth()+1,
                'day':D.getDate(),
                'hour':D.getHours(),
                'minute':D.getMinutes(),
                'second':D.getSeconds(),
                'millsecond':D.getMilliseconds(),
                'timestamp':D.getTime(),
                'week':D.getDay()
            };
        },
        toArray(){
            let $ = this.toObject();
            return periodKey.map(name=>$[name]);
        },
        toString(){
            return this._date.toString();
        },
        toISOString(){
            return this._date.toISOString();
        },
        getTime(){
            return this._date.getTime();
        },
        getUnix(){
            return ~~(this._date.getTime()/1000);
        },
        clone(){
            let that = this;
            let clone =  datex(this.getTime());
            Object.getOwnPropertyNames(that).forEach(function(name){
                if(name!='_date'){
                    clone[name] = that[name];
                }
            });
            return clone;
        },
        isValid(){
            return !isNaN(this.getTime());
        },
        set(unit,value){
            let D = this._date;
            let $ = this.toObject();
            switch (unit) {
                case 'year':
                    D.setFullYear(value);
                    break;
                case 'month':
                    D.setMonth(value-1);
                    break;
                case 'day':
                    D.setDate(value);
                    break;
                case 'hour':
                    D.setHours(value);
                    break;
                case 'minute':
                    D.setMinutes(value);
                    break;
                case 'second':
                    D.setSeconds(value);
                    break;
                case 'millsecond':
                    D.setMilliseconds(value);
                    break;
                case 'timestamp':
                    D.setTime(value);
                    break;
                case 'week':
                    D.setDate($.day-$.week+value);
                    break;
            }
            return this;
        },
        change(unit,value){
            let $ = this.toObject();
            if(['day','hour','minute','second','millsecond'].includes(unit)){
                return this.set('timestamp',$['timestamp']+value*periodMap[unit]);
            }else{
                return this.set(unit,$[unit]+value);
            }
        },
        get(unit){
            let $ = this.toObject();
            return $[unit];
        },
        format(pattern = 'YYYY-MM-DD HH:mm:ss'){
            if(typeof pattern=='string'){
                let that = this.clone();
                let D = that._date;
                let $ = that.toObject();
                let match = D.toTimeString().match(/GMT([\+\-])(\d{2})(\d{2})/);
                let map = {
                    'YYYY':(''+$.year).padStart(4,'0'),
                    'YY':(''+($.year%100)).padStart(2,'0'),
                    'M':''+$.month,
                    'D':''+$.day,
                    'H':''+$.hour,
                    'h':''+($.hour%12),
                    'm':''+$.minute,
                    's':''+$.second,
                    'S':''+(~~($.millsecond/100)),
                    'SS':''+(~~($.millsecond/10)),
                    'SSS':''+$.millsecond,
                    'Z':match[1]+match[2]+':'+match[3],
                    'ZZ':match[1]+match[2]+match[3],
                    'A':['AM','PM'][~~($.hour/12)],
                    'a':['am','pm'][~~($.hour/12)],
                    'X':$.timestamp,
                    'x':~~($.timestamp/1000),
                    'Q':''+(~~($.month/3)),
                    'W':$.week
                };
                return pattern.replace(/Y+|M+|D+|H+|h+|m+|s+|S+|Z+|A|a|X|x|Q|W+/g,function(key){
                    return map[key]||map[key[0]].padStart(key.length,'0')||'';
                });
            }else if(typeof pattern=='function'){
                return pattern(this.toObject()).toString()||'';
            }
        }
    });
};
