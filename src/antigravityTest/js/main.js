document.addEventListener("DOMContentLoaded", function () {
  const integerArray = [];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );

  const animationTokens = {};

  const getElement = (id) => document.getElementById(id);

  const sleep = (time) =>
    new Promise((resolve) => {
      window.setTimeout(resolve, reducedMotion.matches ? 0 : time);
    });

  const numberInput = getElement("numberInput");
  const addNumberBtn = getElement("addNumberBtn");
  const quickCalculateBtn = getElement("quickCalculateBtn");
  const resetArrayBtn = getElement("resetArrayBtn");
  const integerArrayDisplay = getElement("integerArrayDisplay");
  const arrayInputMessage = getElement("arrayInputMessage");

  // ==============================
  // HÀM DÙNG CHUNG
  // ==============================

  function nextToken(taskKey) {
    animationTokens[taskKey] =
      (animationTokens[taskKey] || 0) + 1;

    return animationTokens[taskKey];
  }

  function isCurrentToken(taskKey, token) {
    return animationTokens[taskKey] === token;
  }

  function setInputMessage(message, isError = false) {
    arrayInputMessage.textContent = message;
    arrayInputMessage.classList.toggle("is-error", isError);
  }

  function showFormula(id, message) {
    getElement(id).textContent = message;
  }

  function showResult(id, message, isError = false) {
    const result = getElement(id);

    result.textContent = message;
    result.classList.toggle("array-result--error", isError);
  }

  function createArrayBox(value, index) {
    const box = document.createElement("div");
    box.className = "array-box";
    box.dataset.index = String(index);

    const indexLabel = document.createElement("span");
    indexLabel.className = "array-box__index";
    indexLabel.textContent = `i=${index}`;

    const number = document.createElement("strong");
    number.className = "array-box__value";
    number.textContent = String(value);

    box.append(indexLabel, number);

    return box;
  }

  function renderIntegerArray() {
    integerArrayDisplay.replaceChildren();

    if (integerArray.length === 0) {
      const empty = document.createElement("span");

      empty.className = "array-empty-state";
      empty.textContent = "Mảng chưa có phần tử";

      integerArrayDisplay.appendChild(empty);
      return;
    }

    integerArray.forEach((value, index) => {
      integerArrayDisplay.appendChild(
        createArrayBox(value, index)
      );
    });
  }

  function renderVisualRows(visualId, rows) {
    const visual = getElement(visualId);

    visual.replaceChildren();

    return rows.map((row) => {
      const rowElement = document.createElement("div");
      rowElement.className = "array-visual-row";

      const label = document.createElement("span");
      label.className = "array-visual-row__label";
      label.textContent = row.label;

      const boxes = document.createElement("div");
      boxes.className = "array-visual-boxes";

      const rowBoxes = row.values.map((value, index) => {
        const box = createArrayBox(value, index);

        boxes.appendChild(box);
        return box;
      });

      if (row.values.length === 0) {
        const empty = document.createElement("span");

        empty.className = "array-empty-state";
        empty.textContent = "Không có phần tử";

        boxes.appendChild(empty);
      }

      rowElement.append(label, boxes);
      visual.appendChild(rowElement);

      return rowBoxes;
    });
  }

  function addVisualStatus(visualId, message) {
    const status = document.createElement("div");

    status.className = "array-visual-status";
    status.textContent = message;

    getElement(visualId).appendChild(status);

    return status;
  }

  function markFinalBoxes(boxes, predicate) {
    boxes.forEach((box, index) => {
      const className = predicate(index)
        ? "is-selected"
        : "is-muted";

      box.classList.add(className);
    });
  }

  function ensureIntegerArray(
    resultId,
    formulaId,
    visualId,
    data
  ) {
    if (data.length > 0) {
      return true;
    }

    getElement(visualId).replaceChildren();

    showFormula(
      formulaId,
      "Chưa có dữ liệu để thực hiện."
    );

    showResult(
      resultId,
      "Vui lòng thêm ít nhất một số nguyên vào mảng.",
      true
    );

    return false;
  }

  // ==============================
  // NHẬP MẢNG
  // ==============================

  function addNumber() {
    const rawValue = numberInput.value.trim();
    const value = Number(rawValue);

    if (rawValue === "") {
      setInputMessage(
        "Vui lòng nhập một số nguyên.",
        true
      );

      numberInput.focus();
      return;
    }

    if (!Number.isInteger(value)) {
      setInputMessage(
        "Giá trị nhập vào phải là số nguyên.",
        true
      );

      numberInput.focus();
      return;
    }

    integerArray.push(value);
    renderIntegerArray();

    setInputMessage(`Đã thêm ${value} vào mảng.`);

    numberInput.value = "";
    numberInput.focus();
  }

  addNumberBtn.addEventListener("click", addNumber);

  numberInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      addNumber();
    }
  });

  // ==============================
  // KIỂM TRA SỐ NGUYÊN TỐ
  // ==============================

  function isPrime(number) {
    if (number < 2) {
      return false;
    }

    for (
      let divisor = 2;
      divisor <= Math.sqrt(number);
      divisor++
    ) {
      if (number % divisor === 0) {
        return false;
      }
    }

    return true;
  }

  // ==============================
  // BÀI 1
  // ==============================

  async function runTask1({
    data = [...integerArray],
    animate = true,
  } = {}) {
    const taskKey = "task1";
    const token = nextToken(taskKey);
    const visualId = "sumPositiveVisual";
    const formulaId = "sumPositiveFormula";
    const resultId = "sumPositiveResult";

    if (
      !ensureIntegerArray(
        resultId,
        formulaId,
        visualId,
        data
      )
    ) {
      return false;
    }

    const [boxes] = renderVisualRows(visualId, [
      {
        label: "Mảng",
        values: data,
      },
    ]);

    const status = addVisualStatus(
      visualId,
      "Tổng hiện tại: 0"
    );

    let sum = 0;
    const positives = [];

    for (let index = 0; index < data.length; index++) {
      if (!isCurrentToken(taskKey, token)) {
        return false;
      }

      if (animate) {
        boxes[index].classList.add("is-active");
      }

      if (data[index] > 0) {
        sum += data[index];
        positives.push(data[index]);

        boxes[index].classList.add("is-selected");
        status.textContent =
          `Cộng ${data[index]} → Tổng: ${sum}`;
      } else {
        boxes[index].classList.add("is-muted");
        status.textContent =
          `${data[index]} không phải số dương → Bỏ qua`;
      }

      if (animate) {
        await sleep(260);
        boxes[index].classList.remove("is-active");
      }
    }

    const expression =
      positives.length > 0
        ? positives.join(" + ")
        : "0";

    showFormula(
      formulaId,
      `Các số dương: [${positives.join(", ") || "không có"}] → ${expression} = ${sum}`
    );

    showResult(
      resultId,
      `Tổng các số dương: ${sum}`
    );

    return true;
  }

  // ==============================
  // BÀI 2
  // ==============================

  async function runTask2({
    data = [...integerArray],
    animate = true,
  } = {}) {
    const taskKey = "task2";
    const token = nextToken(taskKey);
    const visualId = "countPositiveVisual";
    const formulaId = "countPositiveFormula";
    const resultId = "countPositiveResult";

    if (
      !ensureIntegerArray(
        resultId,
        formulaId,
        visualId,
        data
      )
    ) {
      return false;
    }

    const [boxes] = renderVisualRows(visualId, [
      {
        label: "Mảng",
        values: data,
      },
    ]);

    const status = addVisualStatus(
      visualId,
      "Bộ đếm: 0"
    );

    const positives = [];

    for (let index = 0; index < data.length; index++) {
      if (!isCurrentToken(taskKey, token)) {
        return false;
      }

      if (animate) {
        boxes[index].classList.add("is-active");
      }

      if (data[index] > 0) {
        positives.push(data[index]);
        boxes[index].classList.add("is-selected");

        status.textContent =
          `${data[index]} > 0 → Bộ đếm: ${positives.length}`;
      } else {
        boxes[index].classList.add("is-muted");

        status.textContent =
          `${data[index]} không phải số dương → Không đếm`;
      }

      if (animate) {
        await sleep(260);
        boxes[index].classList.remove("is-active");
      }
    }

    showFormula(
      formulaId,
      `Số dương: [${positives.join(", ") || "không có"}] → Có ${positives.length} số dương`
    );

    showResult(
      resultId,
      `Số lượng số dương: ${positives.length}`
    );

    return true;
  }

  // ==============================
  // BÀI 3
  // ==============================

  async function runTask3({
    data = [...integerArray],
    animate = true,
  } = {}) {
    const taskKey = "task3";
    const token = nextToken(taskKey);
    const visualId = "findMinVisual";
    const formulaId = "findMinFormula";
    const resultId = "findMinResult";

    if (
      !ensureIntegerArray(
        resultId,
        formulaId,
        visualId,
        data
      )
    ) {
      return false;
    }

    const [boxes] = renderVisualRows(visualId, [
      {
        label: "Mảng",
        values: data,
      },
    ]);

    const status = addVisualStatus(
      visualId,
      `Giá trị nhỏ nhất tạm thời: ${data[0]}`
    );

    let minValue = data[0];
    let minIndex = 0;

    boxes[0].classList.add("is-selected");

    for (let index = 1; index < data.length; index++) {
      if (!isCurrentToken(taskKey, token)) {
        return false;
      }

      if (animate) {
        boxes[index].classList.add("is-active");
      }

      if (data[index] < minValue) {
        boxes[minIndex].classList.remove("is-selected");
        boxes[minIndex].classList.add("is-muted");

        minValue = data[index];
        minIndex = index;

        boxes[index].classList.add("is-selected");

        status.textContent =
          `${data[index]} nhỏ hơn → Min mới: ${minValue}`;
      } else {
        boxes[index].classList.add("is-muted");

        status.textContent =
          `${data[index]} không nhỏ hơn ${minValue} → Giữ nguyên`;
      }

      if (animate) {
        await sleep(280);
        boxes[index].classList.remove("is-active");
      }
    }

    showFormula(
      formulaId,
      `min([${data.join(", ")}]) = ${minValue}`
    );

    showResult(
      resultId,
      `Số nhỏ nhất trong mảng: ${minValue}`
    );

    return true;
  }

  // ==============================
  // BÀI 4
  // ==============================

  async function runTask4({
    data = [...integerArray],
    animate = true,
  } = {}) {
    const taskKey = "task4";
    const token = nextToken(taskKey);
    const visualId = "findMinPositiveVisual";
    const formulaId = "findMinPositiveFormula";
    const resultId = "findMinPositiveResult";

    if (
      !ensureIntegerArray(
        resultId,
        formulaId,
        visualId,
        data
      )
    ) {
      return false;
    }

    let [sourceBoxes] = renderVisualRows(visualId, [
      {
        label: "Mảng gốc",
        values: data,
      },
    ]);

    const status = addVisualStatus(
      visualId,
      "Đang lọc các số dương..."
    );

    // Tạo mảng mới chứa số dương
    const positiveArray = [];

    for (let index = 0; index < data.length; index++) {
      if (!isCurrentToken(taskKey, token)) {
        return false;
      }

      if (animate) {
        sourceBoxes[index].classList.add("is-active");
      }

      if (data[index] > 0) {
        positiveArray.push(data[index]);
        sourceBoxes[index].classList.add("is-selected");

        status.textContent =
          `Đưa ${data[index]} vào mảng số dương`;
      } else {
        sourceBoxes[index].classList.add("is-muted");

        status.textContent =
          `Loại ${data[index]} vì không phải số dương`;
      }

      if (animate) {
        await sleep(240);
        sourceBoxes[index].classList.remove("is-active");
      }
    }

    if (positiveArray.length === 0) {
      renderVisualRows(visualId, [
        {
          label: "Mảng gốc",
          values: data,
        },
        {
          label: "Mảng dương",
          values: [],
        },
      ]);

      addVisualStatus(
        visualId,
        "Không có số dương để tìm giá trị nhỏ nhất"
      );

      showFormula(
        formulaId,
        "Mảng số dương rỗng → Không có số dương nhỏ nhất"
      );

      showResult(
        resultId,
        "Mảng không có số dương.",
        true
      );

      return true;
    }

    const rowBoxes = renderVisualRows(visualId, [
      {
        label: "Mảng gốc",
        values: data,
      },
      {
        label: "Mảng dương",
        values: positiveArray,
      },
    ]);

    sourceBoxes = rowBoxes[0];

    const positiveBoxes = rowBoxes[1];
    const minPositive = Math.min(...positiveArray);
    const minIndex = positiveArray.indexOf(minPositive);

    markFinalBoxes(
      sourceBoxes,
      (index) => data[index] > 0
    );

    positiveBoxes.forEach((box, index) => {
      const className =
        index === minIndex ? "is-selected" : "is-muted";

      box.classList.add(className);
    });

    addVisualStatus(
      visualId,
      `Số dương nhỏ nhất: ${minPositive}`
    );

    showFormula(
      formulaId,
      `Lọc được [${positiveArray.join(", ")}] → min = ${minPositive}`
    );

    showResult(
      resultId,
      `Số dương nhỏ nhất: ${minPositive}`
    );

    return true;
  }

  // ==============================
  // BÀI 5
  // ==============================

  async function runTask5({
    data = [...integerArray],
    animate = true,
  } = {}) {
    const taskKey = "task5";
    const token = nextToken(taskKey);
    const visualId = "findLastEvenVisual";
    const formulaId = "findLastEvenFormula";
    const resultId = "findLastEvenResult";

    if (
      !ensureIntegerArray(
        resultId,
        formulaId,
        visualId,
        data
      )
    ) {
      return false;
    }

    const [boxes] = renderVisualRows(visualId, [
      {
        label: "Mảng",
        values: data,
      },
    ]);

    const status = addVisualStatus(
      visualId,
      "Số chẵn cuối cùng tạm thời: -1"
    );

    const evenNumbers = [];
    let lastEven = -1;
    let lastEvenIndex = -1;

    for (let index = 0; index < data.length; index++) {
      if (!isCurrentToken(taskKey, token)) {
        return false;
      }

      if (animate) {
        boxes[index].classList.add("is-active");
      }

      if (data[index] % 2 === 0) {
        if (lastEvenIndex >= 0) {
          boxes[lastEvenIndex].classList.remove(
            "is-selected"
          );
        }

        evenNumbers.push(data[index]);
        lastEven = data[index];
        lastEvenIndex = index;

        boxes[index].classList.add("is-selected");

        status.textContent =
          `${data[index]} là số chẵn → Cập nhật biến lưu`;
      } else {
        boxes[index].classList.add("is-muted");

        status.textContent =
          `${data[index]} là số lẻ → Bỏ qua`;
      }

      if (animate) {
        await sleep(260);
        boxes[index].classList.remove("is-active");
      }
    }

    showFormula(
      formulaId,
      `Các số chẵn: [${evenNumbers.join(", ") || "không có"}] → Số chẵn cuối = ${lastEven}`
    );

    showResult(
      resultId,
      `Số chẵn cuối cùng: ${lastEven}`
    );

    return true;
  }

  // ==============================
  // ANIMATION ĐỔI CHỖ
  // ==============================

  async function animateSwap(firstBox, secondBox) {
    if (reducedMotion.matches || !firstBox.animate) {
      return;
    }

    const firstRect = firstBox.getBoundingClientRect();
    const secondRect = secondBox.getBoundingClientRect();

    const firstDistanceX =
      secondRect.left - firstRect.left;

    const firstDistanceY =
      secondRect.top - firstRect.top;

    const secondDistanceX =
      firstRect.left - secondRect.left;

    const secondDistanceY =
      firstRect.top - secondRect.top;

    const options = {
      duration: 650,
      easing: "cubic-bezier(.2,.8,.2,1)",
    };

    await Promise.all([
      firstBox.animate(
        [
          {
            transform: "translate(0, 0)",
          },
          {
            transform: `translate(${firstDistanceX / 2}px, ${
              firstDistanceY / 2 - 18
            }px)`,
          },
          {
            transform: `translate(${firstDistanceX}px, ${firstDistanceY}px)`,
          },
        ],
        options
      ).finished,

      secondBox.animate(
        [
          {
            transform: "translate(0, 0)",
          },
          {
            transform: `translate(${secondDistanceX / 2}px, ${
              secondDistanceY / 2 + 18
            }px)`,
          },
          {
            transform: `translate(${secondDistanceX}px, ${secondDistanceY}px)`,
          },
        ],
        options
      ).finished,
    ]);
  }

  // ==============================
  // BÀI 6
  // ==============================

  async function runTask6({
    data = [...integerArray],
    animate = true,
    commit = true,
  } = {}) {
    const taskKey = "task6";
    const token = nextToken(taskKey);
    const visualId = "swapNumbersVisual";
    const formulaId = "swapNumbersFormula";
    const resultId = "swapNumbersResult";

    if (
      !ensureIntegerArray(
        resultId,
        formulaId,
        visualId,
        data
      )
    ) {
      return false;
    }

    const firstRaw =
      getElement("firstPositionInput").value.trim();

    const secondRaw =
      getElement("secondPositionInput").value.trim();

    const firstPosition = Number(firstRaw);
    const secondPosition = Number(secondRaw);

    if (firstRaw === "" || secondRaw === "") {
      getElement(visualId).replaceChildren();

      showFormula(
        formulaId,
        "Cần nhập đủ hai index trước khi đổi chỗ."
      );

      showResult(
        resultId,
        "Vui lòng nhập đầy đủ hai vị trí.",
        true
      );

      return false;
    }

    if (
      !Number.isInteger(firstPosition) ||
      !Number.isInteger(secondPosition)
    ) {
      getElement(visualId).replaceChildren();

      showFormula(
        formulaId,
        "Index phải là số nguyên."
      );

      showResult(
        resultId,
        "Hai vị trí phải là số nguyên.",
        true
      );

      return false;
    }

    if (
      firstPosition < 0 ||
      secondPosition < 0 ||
      firstPosition >= data.length ||
      secondPosition >= data.length
    ) {
      getElement(visualId).replaceChildren();

      showFormula(
        formulaId,
        `Index hợp lệ: 0 đến ${data.length - 1}.`
      );

      showResult(
        resultId,
        `Vị trí hợp lệ từ 0 đến ${data.length - 1}.`,
        true
      );

      return false;
    }

    const [beforeBoxes] = renderVisualRows(visualId, [
      {
        label: "Trước",
        values: data,
      },
    ]);

    beforeBoxes[firstPosition].classList.add(
      "is-selected"
    );

    beforeBoxes[secondPosition].classList.add(
      "is-selected"
    );

    addVisualStatus(
      visualId,
      `Đổi index ${firstPosition} ↔ index ${secondPosition}`
    );

    if (
      animate &&
      firstPosition !== secondPosition
    ) {
      await animateSwap(
        beforeBoxes[firstPosition],
        beforeBoxes[secondPosition]
      );

      if (!isCurrentToken(taskKey, token)) {
        return false;
      }
    }

    const swappedArray = [...data];

    // Dùng biến tạm đổi chỗ
    const temporaryValue =
      swappedArray[firstPosition];

    swappedArray[firstPosition] =
      swappedArray[secondPosition];

    swappedArray[secondPosition] =
      temporaryValue;

    const rowBoxes = renderVisualRows(visualId, [
      {
        label: "Trước",
        values: data,
      },
      {
        label: "Sau",
        values: swappedArray,
      },
    ]);

    rowBoxes[0][firstPosition].classList.add(
      "is-muted"
    );

    rowBoxes[0][secondPosition].classList.add(
      "is-muted"
    );

    rowBoxes[1][firstPosition].classList.add(
      "is-selected"
    );

    rowBoxes[1][secondPosition].classList.add(
      "is-selected"
    );

    addVisualStatus(
      visualId,
      `Hoàn tất đổi chỗ ${data[firstPosition]} và ${data[secondPosition]}`
    );

    showFormula(
      formulaId,
      `temp = ${data[firstPosition]} → array[${firstPosition}] = ${data[secondPosition]} → array[${secondPosition}] = temp`
    );

    showResult(
      resultId,
      `Mảng sau khi đổi: [${swappedArray.join(", ")}]`
    );

    // Chỉ cập nhật mảng chính khi chạy riêng
    if (commit) {
      integerArray.splice(
        0,
        integerArray.length,
        ...swappedArray
      );

      renderIntegerArray();
    }

    return true;
  }

  // ==============================
  // BÀI 7
  // ==============================

  async function runTask7({
    data = [...integerArray],
    animate = true,
    commit = true,
  } = {}) {
    const taskKey = "task7";
    const token = nextToken(taskKey);
    const visualId = "sortAscendingVisual";
    const formulaId = "sortAscendingFormula";
    const resultId = "sortAscendingResult";

    if (
      !ensureIntegerArray(
        resultId,
        formulaId,
        visualId,
        data
      )
    ) {
      return false;
    }

    const originalArray = [...data];
    const workingArray = [...data];

    let [boxes] = renderVisualRows(visualId, [
      {
        label: "Đang xếp",
        values: workingArray,
      },
    ]);

    let status = addVisualStatus(
      visualId,
      "Bắt đầu so sánh các cặp phần tử"
    );

    let swapCount = 0;

    if (animate) {
      for (
        let end = workingArray.length - 1;
        end > 0;
        end--
      ) {
        let changed = false;

        for (let index = 0; index < end; index++) {
          if (!isCurrentToken(taskKey, token)) {
            return false;
          }

          boxes[index].classList.add("is-active");
          boxes[index + 1].classList.add("is-active");

          status.textContent =
            `So sánh ${workingArray[index]} và ${workingArray[index + 1]}`;

          await sleep(220);

          if (
            workingArray[index] >
            workingArray[index + 1]
          ) {
            await animateSwap(
              boxes[index],
              boxes[index + 1]
            );

            const temporaryValue =
              workingArray[index];

            workingArray[index] =
              workingArray[index + 1];

            workingArray[index + 1] =
              temporaryValue;

            swapCount++;
            changed = true;

            [boxes] = renderVisualRows(visualId, [
              {
                label: "Đang xếp",
                values: workingArray,
              },
            ]);

            status = addVisualStatus(visualId, "");

            status.textContent =
              `Đổi chỗ → [${workingArray.join(", ")}]`;
          } else {
            boxes[index].classList.remove("is-active");
            boxes[index + 1].classList.remove(
              "is-active"
            );

            status.textContent =
              "Đúng thứ tự → Giữ nguyên";
          }

          await sleep(160);
        }

        if (!changed) {
          break;
        }
      }
    } else {
      workingArray.sort(
        (firstNumber, secondNumber) =>
          firstNumber - secondNumber
      );

      for (
        let firstIndex = 0;
        firstIndex < originalArray.length;
        firstIndex++
      ) {
        for (
          let secondIndex = firstIndex + 1;
          secondIndex < originalArray.length;
          secondIndex++
        ) {
          if (
            originalArray[firstIndex] >
            originalArray[secondIndex]
          ) {
            swapCount++;
          }
        }
      }
    }

    const finalRows = renderVisualRows(visualId, [
      {
        label: "Ban đầu",
        values: originalArray,
      },
      {
        label: "Tăng dần",
        values: workingArray,
      },
    ]);

    finalRows[0].forEach((box) => {
      box.classList.add("is-muted");
    });

    finalRows[1].forEach((box) => {
      box.classList.add("is-selected");
    });

    addVisualStatus(
      visualId,
      `Hoàn tất sau ${swapCount} lần đổi chỗ`
    );

    showFormula(
      formulaId,
      `[${originalArray.join(", ")}] → so sánh và đổi chỗ → [${workingArray.join(", ")}]`
    );

    showResult(
      resultId,
      `Mảng tăng dần: [${workingArray.join(", ")}]`
    );

    if (commit) {
      integerArray.splice(
        0,
        integerArray.length,
        ...workingArray
      );

      renderIntegerArray();
    }

    return true;
  }

  // ==============================
  // BÀI 8
  // ==============================

  async function runTask8({
    data = [...integerArray],
    animate = true,
  } = {}) {
    const taskKey = "task8";
    const token = nextToken(taskKey);
    const visualId = "findFirstPrimeVisual";
    const formulaId = "findFirstPrimeFormula";
    const resultId = "findFirstPrimeResult";

    if (
      !ensureIntegerArray(
        resultId,
        formulaId,
        visualId,
        data
      )
    ) {
      return false;
    }

    const [boxes] = renderVisualRows(visualId, [
      {
        label: "Mảng",
        values: data,
      },
    ]);

    const status = addVisualStatus(
      visualId,
      "Đang tìm số nguyên tố đầu tiên..."
    );

    let firstPrime = -1;

    for (let index = 0; index < data.length; index++) {
      if (!isCurrentToken(taskKey, token)) {
        return false;
      }

      if (animate) {
        boxes[index].classList.add("is-active");
      }

      if (isPrime(data[index])) {
        firstPrime = data[index];

        boxes[index].classList.add("is-selected");

        status.textContent =
          `${data[index]} là số nguyên tố → Dừng vòng lặp`;

        if (animate) {
          await sleep(300);
        }

        boxes[index].classList.remove("is-active");

        // Dừng ngay khi tìm thấy số nguyên tố
        break;
      }

      boxes[index].classList.add("is-muted");

      status.textContent =
        `${data[index]} không phải số nguyên tố → Tiếp tục`;

      if (animate) {
        await sleep(250);
        boxes[index].classList.remove("is-active");
      }
    }

    if (firstPrime === -1) {
      showFormula(
        formulaId,
        "Duyệt hết mảng nhưng không tìm thấy số nguyên tố → -1"
      );
    } else {
      showFormula(
        formulaId,
        `Duyệt từ trái sang phải → gặp ${firstPrime} là số nguyên tố → break`
      );
    }

    showResult(
      resultId,
      `Số nguyên tố đầu tiên: ${firstPrime}`
    );

    return true;
  }

  // ==============================
  // BÀI 9
  // ==============================

  function parseRealArray() {
    const rawValue =
      getElement("realArrayInput").value.trim();

    if (rawValue === "") {
      return {
        error: "Vui lòng nhập mảng số thực.",
      };
    }

    const parts = rawValue
      .split(",")
      .map((part) => part.trim());

    const hasInvalidValue = parts.some(
      (part) =>
        part === "" ||
        Number.isNaN(Number(part))
    );

    if (hasInvalidValue) {
      return {
        error:
          "Mảng không hợp lệ. Hãy ngăn cách các số bằng dấu phẩy.",
      };
    }

    return {
      values: parts.map(Number),
    };
  }

  async function runTask9({
    animate = true,
  } = {}) {
    const taskKey = "task9";
    const token = nextToken(taskKey);
    const visualId = "countIntegerVisual";
    const formulaId = "countIntegerFormula";
    const resultId = "countIntegerResult";
    const parsed = parseRealArray();

    if (parsed.error) {
      getElement(visualId).replaceChildren();

      showFormula(
        formulaId,
        "Nhập dữ liệu theo dạng: 1, 2.5, 3, 4.7"
      );

      showResult(
        resultId,
        parsed.error,
        true
      );

      return false;
    }

    const realArray = parsed.values;

    const [boxes] = renderVisualRows(visualId, [
      {
        label: "Mảng thực",
        values: realArray,
      },
    ]);

    const status = addVisualStatus(
      visualId,
      "Đang kiểm tra Number.isInteger()..."
    );

    const integers = [];
    const decimals = [];

    for (
      let index = 0;
      index < realArray.length;
      index++
    ) {
      if (!isCurrentToken(taskKey, token)) {
        return false;
      }

      if (animate) {
        boxes[index].classList.add("is-active");
      }

      if (Number.isInteger(realArray[index])) {
        integers.push(realArray[index]);
        boxes[index].classList.add("is-selected");

        status.textContent =
          `${realArray[index]} là số nguyên → Bộ đếm: ${integers.length}`;
      } else {
        decimals.push(realArray[index]);
        boxes[index].classList.add("is-muted");

        status.textContent =
          `${realArray[index]} là số thực → Không đếm`;
      }

      if (animate) {
        await sleep(260);
        boxes[index].classList.remove("is-active");
      }
    }

    const rows = renderVisualRows(visualId, [
      {
        label: "Số nguyên",
        values: integers,
      },
      {
        label: "Số thực",
        values: decimals,
      },
    ]);

    rows[0].forEach((box) => {
      box.classList.add("is-selected");
    });

    rows[1].forEach((box) => {
      box.classList.add("is-muted");
    });

    addVisualStatus(
      visualId,
      `Tìm thấy ${integers.length} số nguyên`
    );

    showFormula(
      formulaId,
      `Number.isInteger → [${integers.join(", ") || "không có"}] → Đếm = ${integers.length}`
    );

    showResult(
      resultId,
      `Số lượng số nguyên: ${integers.length}`
    );

    return true;
  }

  // ==============================
  // BÀI 10
  // ==============================

  async function runTask10({
    data = [...integerArray],
    animate = true,
  } = {}) {
    const taskKey = "task10";
    const token = nextToken(taskKey);
    const visualId = "compareNumbersVisual";
    const formulaId = "compareNumbersFormula";
    const resultId = "compareNumbersResult";

    if (
      !ensureIntegerArray(
        resultId,
        formulaId,
        visualId,
        data
      )
    ) {
      return false;
    }

    const [boxes] = renderVisualRows(visualId, [
      {
        label: "Mảng",
        values: data,
      },
    ]);

    const status = addVisualStatus(
      visualId,
      "Số dương: 0 · Số âm: 0"
    );

    const positives = [];
    const negatives = [];

    for (let index = 0; index < data.length; index++) {
      if (!isCurrentToken(taskKey, token)) {
        return false;
      }

      if (animate) {
        boxes[index].classList.add("is-active");
      }

      if (data[index] > 0) {
        positives.push(data[index]);
        boxes[index].classList.add("is-positive");
      } else if (data[index] < 0) {
        negatives.push(data[index]);
        boxes[index].classList.add("is-negative");
      } else {
        boxes[index].classList.add("is-muted");
      }

      status.textContent =
        `Số dương: ${positives.length} · Số âm: ${negatives.length}`;

      if (animate) {
        await sleep(240);
        boxes[index].classList.remove("is-active");
      }
    }

    let comparison =
      "Số lượng số dương và số âm bằng nhau.";

    if (positives.length > negatives.length) {
      comparison = "Số dương nhiều hơn số âm.";
    }

    if (negatives.length > positives.length) {
      comparison = "Số âm nhiều hơn số dương.";
    }

    const rows = renderVisualRows(visualId, [
      {
        label: `Dương (${positives.length})`,
        values: positives,
      },
      {
        label: `Âm (${negatives.length})`,
        values: negatives,
      },
    ]);

    rows[0].forEach((box) => {
      box.classList.add("is-positive");
    });

    rows[1].forEach((box) => {
      box.classList.add("is-negative");
    });

    addVisualStatus(visualId, comparison);

    showFormula(
      formulaId,
      `${positives.length} số dương ↔ ${negatives.length} số âm → ${comparison}`
    );

    showResult(resultId, comparison);

    return true;
  }

  // ==============================
  // GẮN SỰ KIỆN TỪNG BÀI
  // ==============================

  getElement("sumPositiveBtn").addEventListener(
    "click",
    () => runTask1()
  );

  getElement("countPositiveBtn").addEventListener(
    "click",
    () => runTask2()
  );

  getElement("findMinBtn").addEventListener(
    "click",
    () => runTask3()
  );

  getElement("findMinPositiveBtn").addEventListener(
    "click",
    () => runTask4()
  );

  getElement("findLastEvenBtn").addEventListener(
    "click",
    () => runTask5()
  );

  getElement("swapNumbersBtn").addEventListener(
    "click",
    () => runTask6()
  );

  getElement("sortAscendingBtn").addEventListener(
    "click",
    () => runTask7()
  );

  getElement("findFirstPrimeBtn").addEventListener(
    "click",
    () => runTask8()
  );

  getElement("countIntegerBtn").addEventListener(
    "click",
    () => runTask9()
  );

  getElement("compareNumbersBtn").addEventListener(
    "click",
    () => runTask10()
  );

  // ==============================
  // TÍNH NHANH TẤT CẢ
  // ==============================

  quickCalculateBtn.addEventListener(
    "click",
    async function () {
      if (integerArray.length === 0) {
        setInputMessage(
          "Vui lòng thêm ít nhất một số nguyên trước khi tính nhanh.",
          true
        );

        numberInput.focus();
        return;
      }

      const snapshot = [...integerArray];

      quickCalculateBtn.disabled = true;
      quickCalculateBtn.textContent = "Đang tính...";

      const results = await Promise.all([
        runTask1({
          data: snapshot,
          animate: false,
        }),

        runTask2({
          data: snapshot,
          animate: false,
        }),

        runTask3({
          data: snapshot,
          animate: false,
        }),

        runTask4({
          data: snapshot,
          animate: false,
        }),

        runTask5({
          data: snapshot,
          animate: false,
        }),

        runTask6({
          data: snapshot,
          animate: false,
          commit: false,
        }),

        runTask7({
          data: snapshot,
          animate: false,
          commit: false,
        }),

        runTask8({
          data: snapshot,
          animate: false,
        }),

        runTask9({
          animate: false,
        }),

        runTask10({
          data: snapshot,
          animate: false,
        }),
      ]);

      const completedCount = results.filter(Boolean).length;

      setInputMessage(
        `Đã hoàn thành ${completedCount}/10 bài. Các bài thiếu dữ liệu đã hiển thị hướng dẫn riêng.`
      );

      quickCalculateBtn.disabled = false;
      quickCalculateBtn.textContent =
        "Tính nhanh tất cả";
    }
  );

  // ==============================
  // XÓA MẢNG
  // ==============================

  resetArrayBtn.addEventListener(
    "click",
    function () {
      integerArray.length = 0;

      Object.keys(animationTokens).forEach((key) => {
        nextToken(key);
      });

      renderIntegerArray();

      numberInput.value = "";
      getElement("firstPositionInput").value = "";
      getElement("secondPositionInput").value = "";
      getElement("realArrayInput").value = "";

      setInputMessage(
        "Mảng đã được xóa. Hãy nhập dữ liệu mới."
      );

      document
        .querySelectorAll(".array-visual-stage")
        .forEach((visual) => {
          visual.replaceChildren();
        });

      document
        .querySelectorAll(".array-formula__content")
        .forEach((formula) => {
          formula.textContent =
            "Nhấn nút thực hiện để xem từng bước.";
        });

      document
        .querySelectorAll(".array-result")
        .forEach((result) => {
          result.textContent = "Chưa có kết quả";
          result.classList.remove(
            "array-result--error"
          );
        });

      numberInput.focus();
    }
  );

  // ==============================
  // BACK TO TOP
  // ==============================

  const backToTopBtn = getElement("backToTopBtn");

  function updateBackToTopButton() {
    backToTopBtn.classList.toggle(
      "is-visible",
      window.scrollY > 300
    );
  }

  window.addEventListener(
    "scroll",
    updateBackToTopButton,
    {
      passive: true,
    }
  );

  backToTopBtn.addEventListener(
    "click",
    function () {
      window.scrollTo({
        top: 0,
        behavior: reducedMotion.matches
          ? "auto"
          : "smooth",
      });
    }
  );

  // Khởi tạo giao diện
  renderIntegerArray();
  updateBackToTopButton();
});