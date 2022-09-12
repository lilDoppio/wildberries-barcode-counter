// fetching data

const fetchURL = "https://suppliers-stats.wildberries.ru/api/v1/supplier/orders?dateFrom=2022-09-05&flag=&key=OTA5NDg1NzQtYzA4Yy00ZmVlLWEyNTctM2RmYTdhNmY2NDM2";

let fetchData = null;

fetch(fetchURL)
  .then((res) => {
    return res.json();
  })
  .then((res)=> {
    fetchData = res;
  });

// checking for main catalog page
  
const init = () => {
  const mainContainer = document.querySelector(".catalog-page__main");

  if (mainContainer && fetchData) {
    main(mainContainer, fetchData);
  } else {
    setTimeout(() => init(), 1000);
  }
};

init();

function main(container, data) {
  // constants

  const columns = ["Barcode", "Total price"];
  const statsTableStyle = "width:100%;font-size:18px;border:3px solid #8B54F7;padding:20px 20px;margin-bottom:15px;position:absolute;pointer-events:none;opacity:0;text-align:center;";
  const onTableButtonStyle = "font-size:20px;color:#fff;background:#cb11ab linear-gradient(90deg,#bf5ae0 0,#a811da 100%);border-radius:40px;border:none;padding:10px 20px;margin-bottom:15px;";
  
  // set sorted data from "fetch"

  let statsData = data.sort((a, b) => a.barcode - b.barcode);

  // adding table

  const statsTable = document.createElement("table");
  statsTable.style = statsTableStyle;
  container.insertBefore(statsTable, container.firstChild);

  // adding "barcode" and "totalPrice" headers

  const tableHeader = document.createElement("tr");
  statsTable.appendChild(tableHeader);

  const createThElement = function (column) {
    const barcodeColumn = document.createElement("th");
    barcodeColumn.innerText = column;
    tableHeader.appendChild(barcodeColumn);
  };

  columns.forEach((column) => createThElement(column));

  // adding rows on the table

  let barcodeCount = 0

  statsData.forEach((stat) => {
    const existingBarcode = document.getElementById(stat.barcode);

    if (existingBarcode) {
      barcodeCount += 1;

      const existingBarcodeTotalPrice = document.getElementById(`${stat.barcode}-price`);

      existingBarcode.innerText = `${stat.barcode} (${barcodeCount})`;
      existingBarcodeTotalPrice.innerText = parseInt(existingBarcodeTotalPrice.innerText) + parseInt(stat.totalPrice);
    } else {
      barcodeCount = 1;

      const statRow = document.createElement("tr");
      const barcode = document.createElement("td");
      const totalPrice = document.createElement("td");

      barcode.innerText = stat.barcode;
      totalPrice.innerText = stat.totalPrice;

      barcode.setAttribute("id", stat.barcode);
      totalPrice.setAttribute("id", `${stat.barcode}-price`);
      
      statRow.appendChild(barcode);
      statRow.appendChild(totalPrice);
      statsTable.appendChild(statRow);
    }
  });

  // adding open/close table button on the page

  const onTableButton = document.createElement("button");
  onTableButton.style = onTableButtonStyle;
  onTableButton.innerText = "Открыть таблицу";

  container.insertBefore(onTableButton, container.firstChild);

  // open/close logic

  let isOpen = false;

  onTableButton.addEventListener("click", () => {
    if (isOpen) {
      statsTable.style.opacity = 0;
      statsTable.style.pointerEvents = "none";
      statsTable.style.position = "absolute";

      onTableButton.innerText = "Открыть таблицу";
    } else {
      statsTable.style.opacity = 1;
      statsTable.style.pointerEvents = "all";
      statsTable.style.position = "relative";

      onTableButton.innerText = "Закрыть таблицу";
    }
    isOpen = !isOpen;
  });

  // adding message that extension is working

  const simpleText = document.createElement('div');
  simpleText.style = 'font-size:24px;padding-bottom:10px;';
  simpleText.innerText = 'Расширение работает корректно';

  container.insertBefore(simpleText, container.firstChild);

  // listening on page changes

  (function onPageChangeListener() {
    const mainContainer = document.querySelector(".catalog-page__main");

    if (mainContainer) {
      setTimeout(() => onPageChangeListener(), 1000);
    } else {
      init();
    }
  })();
}
