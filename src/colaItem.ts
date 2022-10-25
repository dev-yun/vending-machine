const MAX_COLA_COUNT = 5;

// 자판기 콜라 선택 아이템 생성 & 선택 function (coke로 할껄...)
interface colaItem {
  image: string;
  type: string;
  color: string;
  price: number;
  count?: number;
}

async function getColas() {
  const response = await fetch('./src/items.json');
  const result = await response.json();
  const colaData = result.items;
  return colaData;
}

const paintVendingColaList = (colaData: any) => {
  const vendingColaParentEl: HTMLUListElement | null =
    document.querySelector('.cola-list');
  if (vendingColaParentEl !== null) {
    vendingColaParentEl.innerHTML = colaData
      .map((cola: colaItem) => vendingColaTemplate(cola))
      .join('');
  }
};

const vendingColaTemplate = (cola: colaItem) => {
  return `<li class="cola-item">
        <button class="vending-cola-button">
          <img src=${cola.image} alt=${cola.color} class="vending-cola_img" />
          <span class="base-font-small cola-type">${cola.type}</span>
          <span class="base-font-normal cola-price">${cola.price}원</span>
        </button>
      </li>`;
};

const vendingColaItemHoverEvent = (vendingColaItems: NodeList) => {
  Array.prototype.forEach.call(
    vendingColaItems,
    (vendingColaItem: HTMLLIElement) => {
      vendingColaItem.addEventListener('mouseover', () => {
        vendingColaItem.classList.add('cola-item_selected');
      });
      vendingColaItem.addEventListener('mouseout', () => {
        vendingColaItem.classList.remove('cola-item_selected');
      });
    }
  );
};

const vendingColaItemClickEvent = (
  vendingColaItems: NodeList,
  colaData: any
) => {
  Array.prototype.forEach.call(
    vendingColaItems,
    (vendingColaItem: HTMLLIElement, index: number) => {
      vendingColaItem.addEventListener('click', () => {
        Object.keys(colaData[index]).includes('count')
          ? rePaintSelectedColaItem(colaData[index])
          : paintSelectedColaItem(colaData[index]);

        console.log(colaData[index]);
      });
    }
  );
};

const paintSelectedColaItem = (colaData: colaItem) => {
  const selectedColaParentEl: HTMLUListElement | null = document.querySelector(
    '.selected-cola-list'
  );
  if (!colaData.count) colaData.count = 1;

  if (selectedColaParentEl) {
    selectedColaParentEl.insertAdjacentHTML(
      'afterbegin',
      horizonColaItemTemplate(colaData)
    );
  }
};

const rePaintSelectedColaItem = (colaData: colaItem) => {
  const selectedColaItems: NodeList = document.querySelectorAll(
    '.selected-cola-item'
  );

  if (colaData.count && colaData.count < MAX_COLA_COUNT) {
    colaData.count ? (colaData.count += 1) : (colaData.count = 1);

    selectedColaItems.forEach((selectedColaItem: any) => {
      if (selectedColaItem.innerText.slice(0, -3) === colaData.type) {
        selectedColaItem.childNodes[1].childNodes[3].childNodes[3].childNodes[0].data =
          colaData.count;
      }
    });
  } else {
    console.log('품절 클래스 추가');
  }
};

//
const horizonColaItemTemplate = (colaData: colaItem) => {
  return `
  <li class="selected-cola-item">
   <figure class="horizontal-cola-figure">
    <img
                    src=${colaData.image}
                    alt=${colaData.color} cola
                    class="vending-cola_img"
                  />
    <figcaption>
      <p class="base-font-small">${colaData.type}</p>
      <p class="horizontal-cola_count base-font-normal_14">${colaData.count}</p>
    </figcaption>
   </figure>
  </li>
  `;
};
// 벤딩머신 관점 : 콜라 클릭 => count가 없으면 count를 1로 초기화 있으면 1추가 => count가 Max-count 상수와 같아지면 판매완료 스타일 추가
// 선택된 콜라 관점 : 콜라 클릭 => count가 1이상이면 화면에 그리기 => event의 target.value와 요청한 colaData[i]가 같으면 해당 콜라의 count만 변경 => 만약 다시 선택된 콜라를 클릭하면

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
    paintVendingColaList(colaData);
    return colaData;
  })
  .then((colaData) => {
    const vendingColaItems: NodeList = document.querySelectorAll('.cola-item');
    vendingColaItemHoverEvent(vendingColaItems);
    vendingColaItemClickEvent(vendingColaItems, colaData);
    return colaData;
  });
