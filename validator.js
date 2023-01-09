function Validator (options) {

    var selectorRules = {};

    //hàm  xử lý valiDate
    function valiDate(inputElement,rule) {
        var errorElement = inputElement.parentElement.querySelector(options.span)
        var errorMesage;
 
        var rules = selectorRules[rule.selector];
        //vòng lặp for có tác dụng lặp qua các phần tử của mảng rules tại đây
        // nếu kiểm tra đc giá trị errMessage là undifined thì sẽ break khỏi vòng lặp
        for (var i = 0; i < rules.length ; ++i) {
            errorMesage = rules[i](inputElement.value);
            if (errorMesage) break;
        }

        //Dùng để thêm hoặc xóa báo lỗi.
        if (errorMesage) {
            errorElement.innerText = errorMesage;
            inputElement.parentElement.classList.add('invalid')
        } else {
            errorElement.innerText = '';
            inputElement.parentElement.classList.remove('invalid')
        }
        return !errorMesage
    }            
                    
    var formElement = document.querySelector(options.form);
    
    if (formElement) {
        //bỏ qua hành vi mặc định
        formElement.onsubmit = function(e) {
            e.preventDefault();
            var isFormValid = true;

            //lặp qua tất cả các thẻ input
            options.rules.forEach(function (rule) {

                var inputElement = formElement.querySelector(rule.selector);
                var isvalid = valiDate(inputElement,rule);
                if(!isvalid) {
                    isFormValid = false;
                }
            });
            
            var enableInputs = formElement.querySelectorAll('[name]');
            
            var formValies = Array.from(enableInputs).reduce(function(values,input) {
                return (values[input.name] = input.value) && values;
            },{});
            console.log(formValies)


            if (isFormValid) {
                if (typeof options.onSubmit === 'function') {

                }
            }
        };
        
        
    } 
    if (formElement) {
        //lặp  qua tất cả các phần tử của rules
        options.rules.forEach(function (rule) {

            
            //lưu lại các rule
            //logic lưu rule:Đầu tiên kiểm tra xem selectorRules[rule.selector]
            // có phải là một mảng hay k nếu k phải là mảng ta sẽ đẩy sang else 
            // tại else ta sẽ gán giá trị đầu tiên của nó là 1 mảng và nếu lặp thêm 
            // 1 lần nữa thì ta sẽ push giá trị đó vào mảng.
            if (Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test];
            }



            var inputElement = formElement.querySelector(rule.selector);


            //hàm xử lý khi blur ra khỏi input
            if (inputElement) {
                inputElement.onblur = function() {
                    valiDate(inputElement,rule);
                }
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(options.span);
                    errorElement.innerText = '';
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        });

    }
}

Validator.isRequied = function(selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : 'Vui lòng nhập trường này !';
        }
    }
};
Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : 'Vui lòng nhập trường email !'
        }
    }
}
Validator.isPass = function (selector,minlenght ,message) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= minlenght ? undefined : message || 'Vui lòng nhập trường này !';
        }
    }
}
Validator.isConfirmed = function (selector,confirmed,message) {
    return {
        selector: selector,
        test: function (value) {
            return value === confirmed() ? undefined : message || 'Giá trị nhập vào không chính xác';
        }
    }
}