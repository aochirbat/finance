// Дэлгэцтэй ажиллах контроллер
var uiController = (function(){
    var DOMstrings ={
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value', 
        addBtn: '.add__btn',
    };
    return { 
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, 
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },
        getDomStrings: function(){
            return DOMstrings;
        }
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
            }
        };
        return {
            addItem: function(type, desc, val){
              var item;
              // identification 

              if(data.allItems[type].length === 0){
                  id = 1;
              } else {
                  id = data.allItems[type][data.allItems[type].length - 1].id + 1;
              }
                if( type === "inc"){
                    item = new Income(id , desc , val);
                }else {
                    item = new Expense(id , desc , val);
                }
                data.allItems[type].push(item);
            }
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
})();

//Програмын холбогч контроллер
var appController = (function(uiController , fnController){
        var ctrlAddItem = function(){
          // 1. Оруулах өгөгдөлийг дэлгэцээс олж авна.
            var input = uiController.getInput();
        // 2. Олж авсан өгөгдлүүдээ санхүүгийн контроллерт дамжуулж тэнд хадгална.
            financeController.addItem(input.type,input.description, input.value);

        // 3. Олж авсан өгөгдлүүдээ вэб дээрээ тохирох хэсэгт нь гаргана 

        // 4. Төсвийг тооцоолно.

        // 5. Эцсийн үлдэгдэл, тооцоог дэлгэцэнд гаргана.
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
            setupEventListeners();
        }
    }
    
})(uiController , financeController);

appController.init();