// @ts-check;

const formatToDecimalUnit = (value) => {
  value = value.toFixed(2);
 
  let suffix = ',00';
  let formattedString="" ;
  if (value % 1 != 0) {
    if (value.toString().split('.')[1].length == 2 && value.toString().slice(0, -1)!=0 )
      formattedString=value.toString().replace('.', ',');
    else  
    {
     formattedString=value.toString().split('.')[0] + ',' + value.toString().split('.')[1] + '0';
    }
  } else  
     formattedString=value.toString().replace('.', ',');
    
  return formattedString;
};

export  {formatToDecimalUnit};
