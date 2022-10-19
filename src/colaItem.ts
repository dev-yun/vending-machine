// 자판기 콜라 선택 아이템 생성 & 선택 function (coke로 할껄...)
interface colaItem {
  image: string;
  type: string;
  color: string;
  price?: number;
}
interface selectedColaItem extends colaItem {
  count: number;
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

const selectColaItemHoverEvent = (colaItems: NodeList) => {
  Array.prototype.forEach.call(colaItems, (colaItem: HTMLLIElement) => {
    colaItem.addEventListener('mouseover', () => {
      colaItem.classList.add('cola-item_selected');
    });
    colaItem.addEventListener('mouseout', () => {
      colaItem.classList.remove('cola-item_selected');
    });
  });
};

const selectColaItemClickEvent = (colaItems: NodeList, colaList: any) => {
  Array.prototype.forEach.call(
    colaItems,
    (colaItem: Element, index: number) => {
      colaItem.addEventListener('click', () => {
        console.log(colaList[index]);
        paintSelectedCola(colaList[index]);
      });
    }
  );
};

// 클릭 횟수를 기준으로 count가 올라가도록 해야함
// 자판기 콜라와 선택된 콜라가 맵핑되어 같은 상태(count)를 공유해야함
// 즉, 선택된 콜라를 클릭하면 선택된 콜라와 자판기 콜라가 리렌더링되고,
// 자판기 콜라를 클릭하면 자판기 콜라와 선택된 콜라가 리렌더링되야함

// paint는 자판기에서 클릭될때 +count, 선택된 콜라를 클릭할때 -count를 해야함
// (count === 0 => 선택된 콜라 삭제), (count === max => 자판기 콜라 class style 추가)

const paintSelectedCola = (colaItem: selectedColaItem) => {
  const selectedColaParent: HTMLUListElement | null = document.querySelector(
    '.selected-cola-list'
  );
  if (selectedColaParent !== null) {
    selectedColaParent.insertAdjacentHTML(
      'afterbegin',
      `<li class="selected-cola-item">
    <figure class="horizontal-cola-figure">
    <img
                   src=${colaItem.image}
                   alt=${colaItem.color}
                   class="vending-cola_img"
                 />
    <figcaption>
    <p class="base-font-small">${colaItem.type}</p>
    <p class="horizontal-cola_count base-font-normal_14">${1}</p>
    </figcaption>
    </figure>
    </li>`
    );
  }
};

// then 1 : colaList를 만들고 hover이벤트 추가 =>
// then 2 : 음료 클릭 => 선택한 음료를 추가
// => (안보이지만 선택한 음료의 총합 금액 저장) => 획득
// => 획득한 음료로 이동

getColas()
  .then((colaList) => {
    paintColaList(colaList);
    return colaList;
  })
  .then((colaList) => {
    const selectCola: NodeList = document.querySelectorAll('.cola-item');
    selectColaItemHoverEvent(selectCola);
    selectColaItemClickEvent(selectCola, colaList);
  });
