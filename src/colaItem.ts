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
          ? rePaintSelectedColaItem(colaData[index], vendingColaItem)
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

const rePaintSelectedColaItem = (
  colaData: colaItem,
  vendingColaItem: HTMLLIElement
) => {
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
  }

  if (colaData.count === MAX_COLA_COUNT) {
    vendingColaItem.classList.add('cola-item_sold-out');
  } else {
    vendingColaItem.classList.remove('cola-item_sold-out');
  }
};

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

// todo : 똑같은 방식으로 선택된 콜라 클릭시 colaData를 -1 => rePaintSelectedColaItem을 호출해서 다시 그린 뒤 (이때 품절 상태 지우기도 함께 작동) ? 이건 count+ 이벤트라서 새로 만들어야하나.. => 어쨋튼 colaData만 count 줄이면 될듯
// 다음 과제 => price * count만큼 계산해서 콜라 비용을 구하기 & 입금액과 빼기 & 남은돈 잔액에 추가하기

// 벤딩머신 관점 : 콜라 클릭 => count가 없으면 count를 1로 초기화 있으면 1추가 => count가 Max-count 상수와 같아지면 판매완료 스타일 추가
// 선택된 콜라 관점 : 콜라 클릭 => count가 1이상이면 화면에 그리기 => event의 target.value와 요청한 colaData[i]가 같으면 해당 콜라의 count만 변경 => 만약 다시 선택된 콜라를 클릭하면

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
