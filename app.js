// Дэлгэцтэй ажиллах контроллер
var uiController = (function(){
    var DOMstrings ={
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value', 
        addBtn: '.add__btn',
        incomeList: '.income__list',
        expenseList: '.expenses__list',
        tusuvDelgets: ".budget__value",
        orlogoDelgets: ".budget__income--value",
        zarlagaDelgets: ".budget__expenses--value",
        huviDelgets: ".budget__expenses--percentage",
        containerDiv: '.container',
        expPercentage: '.item__percentage',
        dateLabel: '.budget__title--month',
    };

        var nodelistForeach = function(list , callback){
            for(var i = 0 ; i < list.length; i++){
                callback(list[i] , i);
            }
        };
        var formatMoney = function(dun, type){
            dun = "" + dun;
            var x = dun.split("").reverse().join("");
            var y = "";
            var count = 1;
            for(var i = 0; i <x.length;i++){
                y = y + x[i];
                if(count % 3 === 0) y = y + ",";
                count++;
            }
            var z = y
            .split("")
            .reverse()
            .join("");
      
          if (z[0] === ",") z = z.substr(1, z.length - 1);
      
          if (type === "inc") z = "+ " + z;
          else z = "- " + z;
      
          return z;
        };

    return { 
        displayDate: function(){
            var today = new Date();
            document.querySelector(DOMstrings.dateLabel).textContent = today.getFullYear() + " оны " + today.getMonth() + " cарын ";
        },
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, 
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseInt(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        displayPercentage: function(allPercentages){
            var elements = document.querySelectorAll(DOMstrings.expPercentage);

            // ELements bolgoni huwid zarlagiin huwiig massivaas awj shiwj oruulah 
            nodelistForeach(elements , function(el , index){
                el.textContent = allPercentages[index];
            })      
          },
        getDomStrings: function(){
            return DOMstrings;
        },
        clearField: function(){
            var fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);

            // Convert list to array
            var fieldsArr = Array.prototype.slice.call(fields); 
            fieldsArr.forEach(function(el,index,array){
                el.value = "";
            });
            fieldsArr[0].focus();
        },
        tusviigUzuuleh : function(tusuv){
            var type;
            tusuv.tusuv > 0 ? type = "inc":type = "exp";
            document.querySelector(DOMstrings.tusuvDelgets).textContent = formatMoney(tusuv.tusuv , type);
            document.querySelector(DOMstrings.orlogoDelgets).textContent = formatMoney(tusuv.totalInc , "inc");
            document.querySelector(DOMstrings.zarlagaDelgets).textContent = formatMoney(tusuv.totalExp , "exp");
            if(tusuv.huvi !== 0){
                 document.querySelector(DOMstrings.huviDelgets).textContent = tusuv.huvi + "%";
            } else {
                document.querySelector(DOMstrings.huviDelgets).textContent = tusuv.huvi
            }
        },
        addListItem: function(item,type){
            //Орлого зарлагын элементийг агуулсан html-ийг бэлтгэнэ.
                var html , listType;
                if(type === "inc"){
                    listType = DOMstrings.incomeList;
                    html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                } else {
                    listType = DOMstrings.expenseList;
                    html = ' <div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                }
            // Тэр HTML дотроо орлого зарлагын утгуудыг REPLACE ашиглаж өөрчилж өгнө.
                  html = html.replace("%id%", item.id);
                  html = html.replace("%desc%" , item.description);
                  html = html.replace("%value%", formatMoney(item.value , type));
            // Бэлтгэсэн HTML ээ DOM руу хийж өгнө.
                document.querySelector(listType).insertAdjacentHTML('beforeend', html);
        },
        deleteListItem: function(id){
            var el = document.getElementById(id);
            el.parentNode.removeChild(el);
        },
    };
})();


//Санхүүтэй ажиллах контроллер
var financeController = (function(){
    var Income = function(id , description , value){
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Expense = function(id , description , value){
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };
    Expense.prototype.calcPercentage = function(totalIncome){
        if(totalIncome > 0) 
            this.percentage = Math.round((this.value / totalIncome) * 100);
            else this.percentage = 0;
    };
    Expense.prototype.getPercentage = function (){
        return this.percentage;
    };
        var data = {
            allItems:{
                inc : [],
                exp : []
            },
            totals: {
                inc: 0,
                exp: 0
            },

            tusuv: 0,

            huvi: 0

        };
        var calculateTotal = function(type){
            var sum = 0;
            data.allItems[type].forEach(function(el){
                sum = sum + el.value;
            });
            data.totals[type] = sum;
        }
        return {
            tusuvTootsooloh: function(){
                
                // niit orlogin niilberiig tootsoolno.
                calculateTotal('inc');
                // niit zarlagin niilberiig tootsoolno.
                calculateTotal('exp'); 

                // tusuviig shineer tootsolno .
                data.tusuv = data.totals.inc - data.totals.exp;

                // Orlogo zarlagin huwiig tootsoolno.
                if(data.totals.inc > 0){
                data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);
                }else data.huvi = 0;
            },
            tusuvAvah: function(){
                return{
                    tusuv : data.tusuv,
                    huvi : data.huvi,
                    totalInc : data.totals.inc,
                    totalExp : data.totals.exp
                }
            },
            deleteItem: function(type, id){
                var ids = data.allItems[type].map(function(el){
                    return el.id
                });
                var index = ids.indexOf(id);
                if( index !== -1){
                    data.allItems[type].splice(index , 1);
                }

            },
            addItem: function(type, desc, val){
              var item , id;
              // identification 

              if(data.allItems[type].length === 0) id = 1;
               else {
                  id = data.allItems[type][data.allItems[type].length - 1].id + 1;
              };
                if( type === "inc"){
                    item = new Income(id , desc , val);
                }else {
                    item = new Expense(id , desc , val);
                };
                data.allItems[type].push(item);
                return item;
            },
            calculatePercentages: function(){
                data.allItems.exp.forEach(function(el){
                    el.calcPercentage(data.totals.inc);
                });
            },
            getPercentages: function(){
               var allPercentages = data.allItems.exp.map(function(el){
                    return el.getPercentage();
                });
                return allPercentages;
            },
            seeData: function(){
                return data;
            }
        };
})();

//Програмын холбогч контроллер
var appController = (function(uiController , fnController){
            var updateTusuv = function(){
                //  Төсвийг тооцоолно.
                financeController.tusuvTootsooloh();
                //  Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана.
                    var tusuv = financeController.tusuvAvah();
                //  Эцсийн төсвийн тооцоог дэлгэцэнд гаргана.
                    uiController.tusviigUzuuleh(tusuv);
                //  ELementuudiin huviig tootsoolno.
                    financeController.calculatePercentages();
                // Elementuudiin huviig huleej awna.
                    var allPercentages = financeController.getPercentages();
                // Edgeer huviig delgetsend gargana.    
                    uiController.displayPercentage(allPercentages);
            };
            var ctrlAddItem = function(){
                // 1. Оруулах өгөгдөлийг дэлгэцээс олж авна.
                    var input = uiController.getInput();
                    if ( input.description !== '' && input.value !== ''){
                // 2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална.
                        var item = financeController.addItem(
                            input.type,
                            input.description, 
                            input.value);

                // 3. Олж авсан өгөгдлүүдээ вэб дээрээ тохирох хэсэгт нь гаргана 
                        uiController.addListItem(item , input.type);
                        uiController.clearField();
                        updateTusuv();
            };
    }
    var setupEventListeners = function(){
        var DOM = uiController.getDomStrings();
        document.querySelector(DOM.addBtn).addEventListener("click" , function(){
            ctrlAddItem();
          });
          document.addEventListener("keypress", function(event){
              if(event.keyCode === 13 || event.which === 13) {
                  ctrlAddItem();
              }
          });
        document.querySelector(DOM.containerDiv).addEventListener("click" , function(event){
            var id = event.target.parentNode.parentNode.parentNode.parentNode.id;
            if(id){
            var arr = id.split("-");
            var type = arr[0];
            var itemId = parseInt(arr[1]);
            // 1. Sanhuugiin modulias ustgah.
                financeController.deleteItem(type , itemId);
            // 2. delgets dr ustgah. 
                uiController.deleteListItem(id);
            // 3. Niitees hasj delgetsend haruulah.
                updateTusuv();
            }
        });
    };
    return {
        init: function (){
            console.log('Application started.....');
            uiController.displayDate();
            uiController.tusviigUzuuleh({
                tusuv : 0,
                totalInc: 0,
                totalExp: 0,
                huvi: 0
            });
            setupEventListeners();
        }
    }
    
})(uiController , financeController);

appController.init();