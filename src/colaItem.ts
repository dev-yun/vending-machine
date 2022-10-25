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
  const colaData = result.items;
  return colaData;
}

const paintColaList = (colaData: any) => {
  let colaParentEl: HTMLUListElement | null =
    document.querySelector('.cola-list');
  if (colaParentEl !== null) {
    colaParentEl.innerHTML = colaData
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

const vendingColaItemHoverEvent = (vendingColaItems: NodeList) => {
  Array.prototype.forEach.call(vendingColaItems, (colaItem: HTMLLIElement) => {
    colaItem.addEventListener('mouseover', () => {
      colaItem.classList.add('cola-item_selected');
    });
    colaItem.addEventListener('mouseout', () => {
      colaItem.classList.remove('cola-item_selected');
    });
  });
};

// const vendingColaItemClickEvent = (
//   vendingColaItems: NodeList,
//   colaList: any
// ) => {
//   Array.prototype.forEach.call(
//     vendingColaItems,
//     (colaItem: Element, index: number) => {
//       colaItem.addEventListener('click', () => {
//         console.log(colaList[index]);
//         if (colaList[index].count > 0) {
//           colaItem.classList.remove('cola-item_sold-out');
//           colaList[index].selectedCount += 1;
//           paintSelectedCola(colaList[index]);
//         } else {
//           colaItem.classList.add('cola-item_sold-out');
//           colaList[index].count = 1;
//         }
//         colaList[index].count -= 1;
//       });
//     }
//   );
// };

// // todo : 클릭될때 새로운 요소가 추가되는 것이 아니라 기존의 요소에서 colaItem.selectedCount 부분만 변해야함

// const paintSelectedCola = (colaItem: selectedColaItem) => {
//   const selectedColaParent: HTMLUListElement | null = document.querySelector(
//     '.selected-cola-list'
//   );
//   if (selectedColaParent !== null) {
//     selectedColaParent.insertAdjacentHTML(
//       'afterbegin',
//       `<li class="selected-cola-item">
//     <figure class="horizontal-cola-figure">
//     <img
//                    src=${colaItem.image}
//                    alt=${colaItem.color}
//                    class="vending-cola_img"
//                  />
//     <figcaption>
//     <p class="base-font-small">${colaItem.type}</p>
//     <p class="horizontal-cola_count base-font-normal_14">${colaItem.selectedCount}</p>
//     </figcaption>
//     </figure>
//     </li>`
//     );
//   } else {
//   }
// };

// then 1 : colaList를 만들고 hover이벤트 추가 =>
// then 2 : 음료 클릭 => 선택한 음료를 추가
// => (안보이지만 선택한 음료의 총합 금액 저장) => 획득
// => 획득한 음료로 이동

getColas()
  .then((colaData) => {
    paintColaList(colaData);
    return colaData;
  })
  .then((colaData) => {
    const vendingColaItems: NodeList = document.querySelectorAll('.cola-item');
    vendingColaItemHoverEvent(vendingColaItems);
    // 클릭 발생시 count 이동
    // vendingColaItemClickEvent(vendingColaItems, colaList);
    return colaData;
  });
