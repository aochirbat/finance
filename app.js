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
        huviDelgets: ".budget__expenses--percentage"

    };
    return { 
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, 
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseInt(document.querySelector(DOMstrings.inputValue).value)
            };
        },
        getDomStrings: function(){
            return DOMstrings;
        },
        clearField: function(){
            var fields = document.querySelectorAll(DOMstrings.inputDescription + ", " + DOMstrings.inputValue);

            // Convert list to array
            var fieldsArr = Array.prototype.slice.call(fields); 
            for (var i = 0; i < fieldsArr.length; i++){
                fieldsArr[i].value = " ";
            }
            fieldsArr[0].focus();
        },
        addListItem: function(item,type){
            //Орлого зарлагын элементийг агуулсан html-ийг бэлтгэнэ.
                var html , listType;
                if(type === "inc"){
                    listType = DOMstrings.incomeList;
                    html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">+%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
                } else {
                    listType = DOMstrings.expenseList;
                    html = ' <div class="item clearfix" id="expense-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
                }
            // Тэр HTML дотроо орлого зарлагын утгуудыг REPLACE ашиглаж өөрчилж өгнө.
                  html = html.replace("%id%", item.id);
                  html = html.replace("%desc%" , item.description);
                  html = html.replace("%value%", item.value);
            // Бэлтгэсэн HTML ээ DOM руу хийж өгнө.
                document.querySelector(listType).insertAdjacentHTML('beforeend', html);
        },
        tusviigUzuuleh : function(tusuv){
            document.querySelector(DOMstrings.tusuvDelgets).textContent = tusuv.tusuv;
            document.querySelector(DOMstrings.orlogoDelgets).textContent = tusuv.totalInc;
            document.querySelector(DOMstrings.zarlagaDelgets).textContent = tusuv.totalExp;
            if(tusuv.huvi !== 0){
                 document.querySelector(DOMstrings.huviDelgets).textContent = tusuv.huvi + "%";
            } else {
                document.querySelector(DOMstrings.huviDelgets).textContent = tusuv.huvi
            }
        },
    };
})();


//Санхүүтэй ажиллах контроллер
var financeController = (function(){
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
        var Income = function(id , description , value){
            this.id = id;
            this.description = description;
            this.value = value;
        };
        var Expense = function(id , description , value){
            this.id = id;
            this.description = description;
            this.value = value;
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
                data.huvi = Math.round((data.totals.exp / data.totals.inc) * 100);

            },
            tusuvAvah: function(){
                return{
                    tusuv : data.tusuv,
                    huvi : data.huvi,
                    totalInc : data.totals.inc,
                    totalExp : data.totals.exp
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
            seeData: function(){
                return data;
            }
        };
})();

//Програмын холбогч контроллер
var appController = (function(uiController , fnController){
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
                    // 4. Төсвийг тооцоолно.
                        financeController.tusuvTootsooloh();
                    // 5. Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана.
                        var tusuv = financeController.tusuvAvah();
                    // 6. Эцсийн төсвийн тооцоог дэлгэцэнд гаргана.
                        uiController.tusviigUzuuleh(tusuv);
            }
        
    }
    var setupEventListeners = function(){
        var DOM = uiController.getDomStrings();
        document.querySelector(DOM.addBtn).addEventListener("click" , function(){
            ctrlAddItem();
          });
          document.addEventListener("keypress", function(event){
              if(event.keyCode === 13 || event.which === 13) {
                  ctrlAddItem();
              } else {
                  // console.log('oor tovch darj bna');
              }
          });
    };
    return {
        init: function (){
            console.log('Application started.....');
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