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
      vendingColaItem.addEventListener('click', (e) => {
        if (
          vendingColaItem.className.split(' ').includes('cola-item_sold-out')
        ) {
          e.preventDefault();
        } else {
          Object.keys(colaData[index]).includes('count')
            ? rePaintSelectedColaItem(colaData[index], vendingColaItem)
            : paintSelectedColaItem(colaData[index]);
        }
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
  const selectedColaParentEl: any = document.querySelector(
    '.selected-cola-list'
  );

  if (selectedColaParentEl.children.length > 0) {
    if (colaData.count && colaData.count < MAX_COLA_COUNT) {
      colaData.count ? (colaData.count += 1) : (colaData.count = 1);

      for (let i = 0; i < selectedColaParentEl!.children.length; i++) {
        if (
          selectedColaParentEl!.children[i].innerText.slice(0, -3) ===
          colaData.type
        ) {
          selectedColaParentEl!.children[
            i
          ].childNodes[1].childNodes[3].childNodes[3].childNodes[0].data =
            colaData.count;
        }
      }
    }
  } else {
    if (selectedColaParentEl) {
      selectedColaParentEl.insertAdjacentHTML(
        'afterbegin',
        horizonColaItemTemplate(colaData)
      );
    }
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

// 입금액을 입력하고 입금을 누르면 소지금에서 차감되고 잔액으로 변경

// 거스름돈 반환 누르면 잔액이 소지금으로 전환
//  - 콜라의 총 금액이 잔액보다 작을 때 획득을 누르면 잔액 -= 콜라의 총 금액 후 잔액 변경
//  - 콜라의 총 금액이 잔액보다 크면 획득에 x 마우스 호버 이벤트와 아래 경고 문구 출력

// 소지금은 처음에 prompt 창으로 입력?

const pocketEl: HTMLElement | null = document.querySelector('.pocket-money');
const depositEl: HTMLInputElement | null =
  document.querySelector('.deposit-money');
const balanceEl: HTMLElement | null = document.querySelector('.balance');
const totalPrice: HTMLElement | null = document.querySelector('.total-price');
const depositBtn = document.querySelector('.deposit-money-button');
const balanceBtn = document.querySelector('.change-button');
const gainBtn = document.querySelector('.gain-button');

// 1. 입금액 입력하고 입금 버튼 클릭 => 소지금에서 -= 입금액(deposit), 잔액(balance) += 입금액
// 만약 입금액이 소지금보다 크면 입금액 클릭 못함 (preventDefault?)
depositBtn!.addEventListener('click', (e) => {
  const pocketMoney = parseInt(pocketEl!.innerText.slice(0, -1), 10);
  const depositMoney = parseInt(depositEl!.value);
  const balance =
    balanceEl!.innerText.slice(0, -1) === '0'
      ? 0
      : parseInt(balanceEl!.innerText.slice(0, -1), 10);

  if (depositMoney > pocketMoney) {
    e.preventDefault();
  } else {
    pocketEl!.innerText = `${pocketMoney - depositMoney}원`;
    balanceEl!.innerText = `${balance + depositMoney}원`;
    depositEl!.value = '';
  }
});

// 2. 획득 버튼 클릭 시 선택된 콜라의 count * price의 합과 잔액을 비교해서 잔액이 작으면 버튼을 못누르고, 잔액이 크면 획득 성공!
// 획득 버튼 클릭 성공 시 구매한 콜라 리스트에 선택된 콜라 리스트를 그대로 그리기
// 구매한 콜라의 리스트 count * price를 구해서 총금액 변환
gainBtn!.addEventListener('click', (e) => purchasedColaClickEvent(e));

const purchasedColaClickEvent = (e: any) => {
  const balanceEl: HTMLElement | null = document.querySelector('.balance');
  const selectedColaList: Element | null = document.querySelector(
    '.selected-cola-list'
  );
  const purchasedColaList: Element | null = document.querySelector(
    '.purchased-cola-list'
  );

  let selectedPrice = 0;
  const balance =
    balanceEl!.innerText.slice(0, -1) === '0'
      ? 0
      : parseInt(balanceEl!.innerText.slice(0, -1), 10);

  for (let i = 0; i < selectedColaList!.children.length; i++) {
    const selectedColaCount = Number(
      selectedColaList!.children[i].childNodes[1].childNodes[3].childNodes[3]
        .childNodes[0].textContent
    );

    selectedPrice += selectedColaCount * 1000;
  }

  if (balance < selectedPrice) {
    e.preventDefault();
  } else {
    balanceEl!.innerText = `${balance - selectedPrice}원`;
    if (purchasedColaList !== null) {
      purchasedColaList.insertAdjacentHTML(
        'afterbegin',
        selectedColaList!.innerHTML
      );

      selectedColaList!.innerHTML = ``;
    }
    totalPrice!.innerText = `${
      parseInt(totalPrice!.innerText.slice(0, -1), 10) + selectedPrice
    }원`;
  }
};

// 3. 거스름돈 반환 클릭 시 잔액을 빈 값으로 변환하고, 소지금 += 잔액;
balanceBtn!.addEventListener('click', () => {
  const balance =
    balanceEl!.innerText.slice(0, -1) === '0'
      ? 0
      : parseInt(balanceEl!.innerText.slice(0, -1), 10);
  const pocketMoney = parseInt(pocketEl!.innerText.slice(0, -1), 10);

  balanceEl!.innerText = `0원`;
  pocketEl!.innerText = `${balance + pocketMoney}원`;
});

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
