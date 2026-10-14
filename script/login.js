document.getElementById('login-btn').addEventListener('click',
    function(){
                
                // if match thn homepage
        // if not match thn give him alert

        //1. get the mobile number
        const numberInput = document.getElementById('input-number');
        const contractNumber = numberInput.value;
        

        //2.get the pin
        const inputPin = document.getElementById('input-pin');
        const pin = inputPin.value;
        

        if(contractNumber == "01869529572" && pin == "1212"){
            
            window.location.assign("home.html");
            

        } else{
            alert("login Failed.")
            return;
            
        }

    }
)