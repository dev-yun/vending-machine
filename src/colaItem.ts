const MAX_COLA_COUNT = 5;

// 자판기 콜라 선택 아이템 생성 & 선택 function (coke로 할껄...)
interface colaItem {
  image: string;
  type: string;
  color: string;
  price: number;
  count?: number;
}

// json data 가져오기
async function getColas() {
  const response = await fetch('./src/items.json');
  const result = await response.json();
  const colaData = result.items;
  return colaData;
}

// 받아온 json data로 자판기 판매 콜라 생성
const paintVendingColaList = (colaData: any) => {
  const vendingColaParentEl: HTMLUListElement | null =
    document.querySelector('.cola-list');
  if (vendingColaParentEl !== null) {
    vendingColaParentEl.innerHTML = colaData
      .map((cola: colaItem) => vendingColaTemplate(cola))
      .join('');
  }
};

// 실제 그려지는 자판기 콜라 레이아웃 템플릿
const vendingColaTemplate = (cola: colaItem) => {
  return `<li class="cola-item">
        <button class="vending-cola-button">
          <img src=${cola.image} alt=${cola.color} class="vending-cola_img" />
          <span class="base-font-small cola-type">${cola.type}</span>
          <span class="base-font-normal cola-price">${cola.price}원</span>
        </button>
      </li>`;
};

// 자판기 콜라에 hover이벤트 추가
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

// 자판기 콜라 클릭시 선택된 콜라 추가
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

// 선택된 콜라 생성
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

// 콜라가 여러번 클릭되면 이미 생성된 콜라에 count만 변경
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

  toggleSoldOutClass(vendingColaItem, colaData);
};

const toggleSoldOutClass = (
  vendingColaItem: HTMLLIElement,
  colaData: colaItem
) => {
  if (colaData.count === MAX_COLA_COUNT) {
    vendingColaItem.classList.add('cola-item_sold-out');
  } else {
    vendingColaItem.classList.remove('cola-item_sold-out');
  }
};

// 선택된 콜라와 획득한 콜라의 레이아웃 템플릿
const horizonColaItemTemplate = (colaData: colaItem) => {
  return `
  <li class="selected-cola-item">
   <button class="horizontal-cola-button">
    <img
                    src=${colaData.image}
                    alt=${colaData.color} cola
                    class="vending-cola_img"
                  />
    <div>
      <p class="base-font-small">${colaData.type}</p>
      <p class="horizontal-cola_count base-font-normal_14">${colaData.count}</p> 
    </div>
    </button>
  </li>
  `;
};

// 선택된 콜라 클릭 이벤트
const selectedColaClickEvent = (e: any, colaData: colaItem) => {
  const targetCola = e.path.find(
    (item: Element) => item.className === 'selected-cola-item'
  );

  Array.prototype.forEach.call(colaData, (data) => {
    if (data.type === targetCola.innerText.slice(0, -3)) {
      minusSelectedColaCount(data, targetCola);
    }
  });
};

// 선택된 콜라 클릭 시 count -- && 자판기의 품절 클래스 삭제
const minusSelectedColaCount = (colaData: colaItem, selectedCola: any) => {
  const vendingColaItems: NodeList = document.querySelectorAll('.cola-item');

  if (colaData.count && colaData.count > 0) {
    colaData.count -= 1;

    selectedCola.childNodes[1].childNodes[3].childNodes[3].childNodes[0].data =
      colaData.count;
  }

  if (colaData.count === 0) {
    selectedCola.parentNode.removeChild(selectedCola);
    delete colaData.count;
  }

  vendingColaItems.forEach((vendingItem: any) => {
    if (
      vendingItem.innerText.slice(0, -6) === selectedCola.innerText.slice(0, -3)
    ) {
      toggleSoldOutClass(vendingItem, colaData);
    }
  });
};

// 입금, 잔액, 거스름돈, 소지금 관련 ..
// 다음 과제 => price * count만큼 계산해서 콜라 비용을 구하기 & 입금액과 빼기 & 남은돈 잔액에 추가하기

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
  })
  .then((colaData) => {
    const selectedColaList: Element | null = document.querySelector(
      '.selected-cola-list'
    );

    if (selectedColaList !== null) {
      selectedColaList.addEventListener('click', (e: any) => {
        console.log(e);
        e.target.className === 'selected-cola-list scroll_custom'
          ? ''
          : selectedColaClickEvent(e, colaData);
      });
    }
  });
