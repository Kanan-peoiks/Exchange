document.addEventListener('DOMContentLoaded', async () => {
    const rightButtons = document.querySelectorAll('.right-buttons>button');
    const leftButtons = document.querySelectorAll('.left-buttons>button');

    const leftFooterWrapper = document.querySelector('.left-footer-wrapper');
    const rightFooterWrapper = document.querySelector('.right-footer-wrapper');

    const leftInput = document.querySelector('.left-input');
    const rightInput = document.querySelector('.right-input');

    const hamburgerButton = document.querySelector('.hamburger-button');
    const hamburgerWrapper = document.querySelector('.hamburger-wrapper');

    const API_KEY = "a93462dd52d6ea39df4f7585";

    const errorWrapper = document.querySelector('.error-wrapper');
    let leftRate = 1, rightRate = 1;
    let activeInput = "left";

    function updateNetworkStatus() {
        if (!navigator.onLine) {
            errorWrapper.style.display = 'block';
            alert("İnternet bağlantısı yoxdur!");
        } else {
            errorWrapper.style.display = 'none';
        }
    }

    window.addEventListener("online", updateNetworkStatus);
    window.addEventListener("offline", updateNetworkStatus);

    function updateDependentInput() {
        if (activeInput === "left" && leftInput.value !== "") {
            const calculatedValue = (parseFloat(leftInput.value) * leftRate).toFixed(5);
            if (!isNaN(calculatedValue)) {
                rightInput.value = calculatedValue;
            }
        } else if (activeInput === "right" && rightInput.value !== "") {
            const calculatedValue = (parseFloat(rightInput.value) * rightRate).toFixed(5);
            if (!isNaN(calculatedValue)) {
                leftInput.value = calculatedValue;
            }
        }
    }

    leftButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            button.classList.add('active');
            leftButtons.forEach((btn) => {
                if (btn !== button) btn.classList.remove('active');
            });
            await updateFooters();
            updateDependentInput();
        });
    });

    rightButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            button.classList.add('active');
            rightButtons.forEach((btn) => {
                if (btn !== button) btn.classList.remove('active');
            });
            await updateFooters();
            updateDependentInput();
        });
    });

    leftInput.addEventListener('input', (e) => {
        activeInput = "left";
        let inputValue = e.target.value;


        inputValue = inputValue.replace(/[^0-9.,]/g, '');

        let calculationValue = inputValue.replace(/,/g, '.');
    
        
        const commaCount = (inputValue.match(/,/g) || []).length;
        if (commaCount > 1) {
            calculationValue = calculationValue.replace(/,(?=.*,)/g, '');
        }


        if (calculationValue === '0' || /^0{2,}$/.test(calculationValue)) {
            calculationValue = '0';
        }


        const calculatedValue = (parseFloat(calculationValue) * leftRate).toFixed(5);
        if (!isNaN(calculatedValue)) {
            rightInput.value = calculatedValue;
        } else {
            rightInput.value = "";
        }

        e.target.value = inputValue.replace(/\,/g, ".");
    });

    rightInput.addEventListener('input', (e) => {
        activeInput = "right";
        let inputValue = e.target.value;

        inputValue = inputValue.replace(/[^0-9.,]/g, '');

        let calculationValue = inputValue.replace(/./g, ',');

        const commaCount = (inputValue.match(/,/g) || []).length;
        if (commaCount > 1) {
            calculationValue = calculationValue.replace(/.(?=,*,)/g, '');
        }

        if (calculationValue === '0' || /^0{2,}$/.test(calculationValue)) {
            calculationValue = '0';
        }


        const calculatedValue = (parseFloat(calculationValue) * rightRate).toFixed(5);
        if (!isNaN(calculatedValue)) {
            leftInput.value = calculatedValue;
        } else {
            leftInput.value = "";
        }


        e.target.value = inputValue.replace(/\,/g, ".");
    });


    async function updateFooters() {
        const leftActive = document.querySelector('.left-buttons > button.active');
        const rightActive = document.querySelector('.right-buttons > button.active');

        if (leftActive && rightActive) {
            const leftCurrency = leftActive.textContent.trim();
            const rightCurrency = rightActive.textContent.trim();


            if (leftCurrency === rightCurrency) {
                leftRate = 1;
                rightRate = 1;
                leftFooterWrapper.innerText = `1 ${leftCurrency} = 1 ${rightCurrency}`;
                rightFooterWrapper.innerText = `1 ${rightCurrency} = 1 ${leftCurrency}`;

                if (activeInput === "left") {
                    rightInput.value = leftInput.value;
                } else {
                    leftInput.value = rightInput.value;
                }

                return;
            }


            if (!navigator.onLine) {
                alert("İnternet bağlantısı yoxdur!");
                leftFooterWrapper.innerText = 'İnternet bağlantısı yoxdur';
                rightFooterWrapper.innerText = '';
                return;
            }


            const url = `https://v6.exchangerate-api.com/v6/${API_KEY}/pair/${leftCurrency}/${rightCurrency}`;
            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.result === "success") {
                    leftRate = Number(data.conversion_rate);
                    rightRate = 1 / leftRate;
                    leftFooterWrapper.innerText = `1 ${leftCurrency} = ${leftRate.toFixed(5)} ${rightCurrency}`;
                    rightFooterWrapper.innerText = `1 ${rightCurrency} = ${rightRate.toFixed(5)} ${leftCurrency}`;
                } else {
                    console.error('Conversion error:', data['error-type']);
                    leftFooterWrapper.innerText = 'Valyuta məlumatı alınmadı';
                    rightFooterWrapper.innerText = '';
                }
            } catch (err) {
                console.error('Network error:', err);
                leftFooterWrapper.innerText = 'Şəbəkə xətası';
                rightFooterWrapper.innerText = '';
            }
        }
    }


    hamburgerButton.addEventListener('click', () => {
        hamburgerWrapper.classList.toggle('activee');
    });

    function updateNetworkStatus() {
        if (!navigator.onLine) {
            errorWrapper.style.display = 'block';
        } else {
            errorWrapper.style.display = 'none';
        }
    }

    updateNetworkStatus();
    await updateFooters();
});
