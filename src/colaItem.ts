// 자판기 콜라 선택 아이템 생성 & 선택 function (coke로 할껄...)
interface colaItem {
  image: string;
  type: string;
  color: string;
  price: number;
}

async function getColas() {
  const response = await fetch('./src/items.json');
  const result = await response.json();
  const colaList = result.items;
  return colaList;
}

const paintColaList = (colaList: any) => {
  let colaParentEl: HTMLUListElement | null =
    document.querySelector('.cola-list');
  if (colaParentEl !== null) {
    colaParentEl.innerHTML = colaList
      .map((cola: colaItem) => createColaListString(cola))
      .join('');
  }
};

const createColaListString = (cola: colaItem) => {
  return `<li class="cola-item">
        <button class="vending-cola-button">
          <img src=${cola.image} alt=${cola.color} class="vending-cola_img" />
          <span class="base-font-small cola-type">${cola.type}</span>
          <span class="base-font-normal cola-price">${cola.price}원</span>
        </button>
      </li>`;
};

const paintSelectedCola = (colaItem: colaItem) => {
  const selectedColaParent = document.querySelector('');
};

// then 1 : colaList를 만들고 hover이벤트 추가 =>
// => (안보이지만 선택한 음료의 총합 금액 저장) => 획득
// => 획득한 음료로 이동

getColas().then((colaList) => {
  paintColaList(colaList);
  return colaList;
});
