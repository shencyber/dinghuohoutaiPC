/**
* 自定义插件
*@psdt  2017-5-25
*/



const MyPlugin = {

	install(Vue , options){



		/**
		*将秒转换成天数加小时
		*@result  object {"days":1 , "hours":3}
		*
		*example
		*switchSecondsToDaysAndHours(123685)
		*{ days: 1, hours: 10 }
		*/
		Vue.prototype.$switchSecondsToDaysAndHours = function(seconds)
		{
			if( seconds < 3600 && seconds >= 60) 
			return { "days" : "" , "hours" :"" , "minutes": Math.floor( seconds/60 )}
			var days = Math.floor(seconds/3600/24) ;
			var hours = Math.floor((seconds - days*24*3600)/3600) ;
			return {"days" : days , "hours" :hours}
		}

		/**
		*获取当前日期
		*@return String  2017-05-05
		*/
		Vue.prototype.$nowDate = function(){
			let now    = new Date();
			let year   = now.getFullYear();
			let month  = (now.getMonth()+1)>=10?(now.getMonth()+1):('0'+(now.getMonth()+1));
			let date   = (now.getDate())>=10?(now.getDate()):('0'+(now.getDate()));
			return year+"/"+month+"/"+date ;
		},

		/**
		*将日期转换成年月日
		*@param  String Wed Jun 14 2017 00:00:00 GMT+0800 (中国标准时间)
		*/
		Vue.prototype.$getYMD = function( date_string ){
			let now    = new Date( date_string );
			let year   = now.getFullYear();
			let month  = now.getMonth()+1;
			let date   = now.getDate();
			return year+"/"+month+"/"+date ;
		},
		/**
		*日期加减运算
		*@param  date    String  "2017-05-05"
		*@param  days    int     10、-10
		*@return String  "2017-05-15" , "2017-04-25"
		*/
		Vue.prototype.$addDate = function(date,days){ 
			var d=new Date(date); 
			d.setDate(d.getDate()+days); 
			var month=d.getMonth()+1; 
			var day = d.getDate(); 
			if(month<10){ 
			month = "0"+month; 
			} 
			if(day<10){ 
			day = "0"+day; 
			} 
			var val = d.getFullYear()+"-"+month+"-"+day; 
			return val; 
		}

		/**
		 * 计算两个时间之间的时间差
		 * @author psdtcyber 2018-01-29 
		 * @param  {[string]} startDate [开始时间 2018-01-10 10:09:12]
		 * @param  {[string]} endDate   [开始时间 2018-01-11 16:00:00]
		 * @return {[string]}           [1天10小时12分25秒]
		 */
		Vue.prototype.$dateDiff = function dateDiff( startDateString , endDateString )
		{

				var startDate = new Date( startDateString );
				var endDate = new Date( endDateString );
				var diff = (endDate - startDate)/1000 ;
				var secondsFormat = function(s)
				{
					var day = Math.floor( s/ (24*3600) ); // Math.floor()向下取整 
					var hour = Math.floor( (s - day*24*3600) / 3600); 
					var minute = Math.floor( (s - day*24*3600 - hour*3600) /60 ); 
					var second = s - day*24*3600 - hour*3600 - minute*60; 
					return day + " 天 " + hour + " 时 " + minute + " 分 " + second + " 秒 "; 
				}

				return secondsFormat( diff );


		}

		/**
		*在终端输出
		*/
		Vue.prototype.$log = function( ...msg ){

			try{
			if( Vue.config.CONSOLE_CHECK )

			console.log(...msg);

			}
			catch(err){
				console.log( err );
			}
		}


		/**
		 * @author cyber 
		 * js模板编译器
		 * @param  {[string]} str             [带参数的模板字符串]
		 * @param  {[string]} params_str      [变量字符串,不同参数以分隔符隔开]
		 * @param  {[string]} params_separate [变量字符串分隔符]
		 * @return {[string]}                 [已将参数替换为变量的模板字符串]
		 */
		Vue.prototype.$compile = function ( str ,   params_str ,  params_separate=',')
		{
		  var str = str.split(/@.*?@/) ;
		  
		  var params_arr = params_str.split(params_separate);
		  
		  var str_blank_len = 0 ;
		  for( var i=0;i<str.length;i++ )
		  {
		    if( str[i] === "" ) str_blank_len++;
		  }
		  
		  
		  if( str_blank_len !== params_arr.length )  
		  {
		    throw "编译函数参数数量不匹配";
		  }
		  
		  for( var i=0;i<str.length;i++ )
		  {
		      if( str[i] === "" )
		        str[i] = params_arr.shift();
		  }

		  return str ;

		}




	}
}

export default MyPlugin