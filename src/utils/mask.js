//This code only shows the last 4 digits of the account number and * will be shown for other digits

export const maskNumber = (number) => {
    return number.slice(-4).padStart(number.length, '*');
};

