// 디버깅용: main.js가 정상적으로 로드되는지 확인
console.log('main.js loaded');

// 페르소나 템플릿 데이터
const personaTemplates = [
    {
        id: 1,
        name: "MZ세대 트렌드세터",
        age: "20-30",
        income: "연 3천만원 이상",
        interests: ["SNS", "트렌드", "개성"],
        behavior: "독특한 제품 선호, 리뷰 중요시, 소셜 커머스 선호"
    },
    {
        id: 2,
        name: "MZ세대 실용주의자",
        age: "25-35",
        income: "연 4천만원 이상",
        interests: ["가성비", "실용성", "리뷰"],
        behavior: "가성비 중시, 리뷰 중요시, 온라인 쇼핑 선호"
    },
    {
        id: 3,
        name: "MZ세대 브랜드러버",
        age: "20-35",
        income: "연 5천만원 이상",
        interests: ["브랜드", "디자인", "품질"],
        behavior: "브랜드 가치 중시, 디자인 중요시, 오프라인 매장 선호"
    }
];

// DOM이 로드된 후 실행
// 중복 방지: 오직 한 번만 DOMContentLoaded 사용

document.addEventListener('DOMContentLoaded', function() {
    initializePersonaTemplates();
    initializeSimulationControls();
    // initializeBehaviorModel();//
    // initializeBudgetAllocation(); //
   function initializeCampaignPlanning() {
    const startDate = document.getElementById('campaignStart');
    const endDate = document.getElementById('campaignEnd');
    const goal = document.getElementById('campaignGoal');

    // 요소가 모두 있을 때만 실행
    if (startDate && endDate && goal) {
        // 기본 날짜 설정
        const today = new Date();
        startDate.value = today.toISOString().split('T')[0];
        today.setMonth(today.getMonth() + 1);
        endDate.value = today.toISOString().split('T')[0];

        // 이벤트 리스너
        [startDate, endDate, goal].forEach(element => {
            element.addEventListener('change', updateCampaignPlan);
        });
    }
}
    //initializeAnalysis();
//...
    // 시뮬레이션 입력 폼 submit 이벤트에서 새로고침 방지 및 실행 연결
    const simForm = document.getElementById('simulationForm');
    if (simForm) {
        console.log('폼 찾음!');
        simForm.addEventListener('submit', function(event) {
            event.preventDefault();
            console.log('폼 제출 이벤트 정상 작동!');
            // 입력값 읽기
            const target = document.getElementById('targetCustomer').value.trim();
            const goal = document.getElementById('goal').value.trim();
            const strategyText = document.getElementById('strategy').value.trim();
            // 전략 입력값 추출 (메시지, 채널, 가격, 프로모션 등)
            const channel = strategyText.includes('SNS') ? '온라인' : (strategyText.includes('오프라인') ? '오프라인' : '기타');
            let price = 25000;
            const priceMatch = strategyText.match(/([0-9]+)원/);
            if (priceMatch) price = parseInt(priceMatch[1], 10);
            const promotion = /할인|이벤트|쿠폰|증정/.test(strategyText);
            // 전략 객체 생성
            const strategy = {
                message: strategyText,
                channel,
                price,
                promotion
            };
            // 전략별 시뮬레이션 실행
            const result = simulateMarket(strategy);
            // 타겟 고객 반응 생성
            const targetReactions = getTargetCustomerReactions(target);
            // 마케팅 목표별 해석 생성 (자연어 예시/시나리오 추가)
            const goalInterpretations = describeMultipleGoals(goal, result, target);
            // 전략별 매출 영향 분석
            const strategyList = strategyText.split(/\n|\r/).map(s => s.trim()).filter(Boolean);
            const brandImpacts = getBrandSalesImpact(strategyList);
            // 결과 섹션 표시 및 내용 채우기
            const resultSection = document.getElementById('resultSection');
            resultSection.style.display = 'block';
            // AI 예측 결과 + 목표별 해석
            document.getElementById('aiPrediction').innerHTML =
                `<strong>타겟 고객:</strong> ${target}<br>` +
                `<strong>목표:</strong> ${goal}<br>` +
                `<strong>전략:</strong> ${strategyText.replace(/\n/g, '<br>')}<br><br>` +
                `<strong>예측 수치:</strong> 고령층 ${result.elderly}%, 케어기버 ${result.caregiver}%, 긍정 ${result.positive}%, 부정 ${result.negative}%<br>` +
                `<strong>마케팅 목표별 달성 해석:</strong><ul>${goalInterpretations.map(r => `<li>${r}</li>`).join('')}</ul>` +
                `<strong>타겟 고객의 반응:</strong><ul>${targetReactions.map(r => `<li>${r}</li>`).join('')}</ul>` +
                `<strong>전략별 매출 상승 브랜드/상품:</strong><ul>${brandImpacts.map(r => `<li>${r}</li>`).join('')}</ul>`;
            // 성과 그래프 (전략별 결과 반영)
            const ctx = document.getElementById('resultChart').getContext('2d');
            if (window.resultChartInstance) window.resultChartInstance.destroy();
            window.resultChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['고령층', '케어기버', '긍정', '부정'],
                    datasets: [{
                        label: '예측 수치(%)',
                        data: [result.elderly, result.caregiver, result.positive, result.negative],
                        backgroundColor: ['#36a2eb', '#ffcd56', '#4bc0c0', '#ff6384']
                    }]
                },
                options: {scales: {y: {beginAtZero: true, max: 100}}}
            });
            // 예상 손익 그래프 (전략별 결과 반영, 예시)
            const ctx2 = document.getElementById('profitChart').getContext('2d');
            if (window.profitChartInstance) window.profitChartInstance.destroy();
            // 예시: 전략별 긍정률에 따라 손익 곡선 변화
            const base = 10 + Math.round(result.positive / 5);
            window.profitChartInstance = new Chart(ctx2, {
                type: 'line',
                data: {
                    labels: ['1개월', '2개월', '3개월', '4개월', '5개월'],
                    datasets: [{
                        label: '예상 손익(만원)',
                        data: [base, base+10, base+20, base+15, base+30],
                        borderColor: '#007bff',
                        backgroundColor: 'rgba(0,123,255,0.1)',
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {scales: {y: {beginAtZero: true}}}
            });
        });
    } else {
        console.log('폼 못 찾음!');
    }
});

// 페르소나 템플릿 초기화
function initializePersonaTemplates() {
    const simulationSection = document.querySelector('#simulation');
    if (!simulationSection) return;
    const personaCard = simulationSection.querySelector('.card');
    if (!personaCard) return;
    
    // 페르소나 템플릿 목록 생성
    const templateList = document.createElement('div');
    templateList.className = 'template-options';
    
    // 기본 템플릿 추가
    personaTemplates.forEach(template => {
        const templateDiv = document.createElement('div');
        templateDiv.className = 'persona-template';
        templateDiv.innerHTML = `
            <h5>${template.name}</h5>
            <p>연령: ${template.age}</p>
            <p>소득: ${template.income}</p>
            <p>관심사: ${template.interests.join(', ')}</p>
            <p>구매 행동: ${template.behavior}</p>
        `;
        templateDiv.addEventListener('click', () => selectTemplate(templateDiv, template));
        templateList.appendChild(templateDiv);
    });

    // 커스텀 페르소나 버튼 추가
    const customButton = document.createElement('button');
    customButton.className = 'btn btn-outline-primary mt-3';
    customButton.textContent = '커스텀 페르소나 만들기';
    customButton.addEventListener('click', showCustomizeForm);
    templateList.appendChild(customButton);
    
    personaCard.appendChild(templateList);
    
    // 커스텀 페르소나 저장 버튼 이벤트
       const saveBtn = document.getElementById('saveCustomPersona');
   if (saveBtn) {
       saveBtn.addEventListener('click', saveCustomPersona);
   }
}
// 템플릿 선택 처리
function selectTemplate(templateDiv, template) {
    // 이전 선택 제거
    document.querySelectorAll('.persona-template').forEach(el => {
        el.classList.remove('selected');
    });
    
    // 새로운 선택 적용
    templateDiv.classList.add('selected');
    
    // 선택된 템플릿 정보 표시
    const cardTitle = templateDiv.closest('.card').querySelector('.card-title');
    cardTitle.textContent = `선택된 페르소나: ${template.name}`;

    // 자동으로 시뮬레이션 실행
    runSimulation();
}

// 시뮬레이션 컨트롤 초기화
function initializeSimulationControls() {
    const simulationSection = document.querySelector('#simulation');
    if (!simulationSection) return;
    
    // 시뮬레이션 컨트롤 추가
    const controls = document.createElement('div');
    controls.className = 'simulation-controls';
    controls.innerHTML = `
        <h4>시뮬레이션 설정</h4>
        <div class="form-group">
            <label>시뮬레이션 기간 (개월)</label>
            <input type="number" class="form-control" value="12" min="1" max="36">
        </div>
        <div class="form-group">
            <label>예산 (만원)</label>
            <input type="number" class="form-control" value="1000" min="100" step="100">
        </div>
        <button class="btn btn-primary btn-simulate">시뮬레이션 실행</button>
    `;
    
    simulationSection.appendChild(controls);
    
    // 시뮬레이션 실행 버튼 이벤트
    const simulateButton = controls.querySelector('.btn-simulate');
    simulateButton.addEventListener('click', runSimulation);
}

// 시뮬레이션 실행
function runSimulation() {
    // 기본 페르소나 데이터 생성
    const defaultPersona = {
        name: "기본 페르소나",
        age: "20-40",
        income: "연 3천만원 이상",
        interests: ["일반"],
        behavior: "일반적인 구매 행동"
    };
    // 베이지안 네트워크 초기화 및 시뮬레이션 실행
    const network = new BayesianNetwork();
    const results = network.simulatePurchaseDecision(selectedPersona, parseInt(budget));
    
    // 결과 표시
    displaySimulationResults(results, period, budget);
}

// 고령층 및 사회 변화 상세 결과 생성 함수
function getElderlyAndSocialReaction(strategyText) {
    const elderly = [];
    const social = [];
    // 전략 내 키워드 및 문구 기반 분석
    if (strategyText.match(/버스|지하철|경로당/)) {
        elderly.push("버스, 지하철, 경로당 등 익숙한 공간에서 AI 홍보를 접하며 호기심이 증가합니다.");
        elderly.push("실제 사용 사례(영상, 포스터)로 AI에 대한 두려움이 줄어듭니다.");
        elderly.push("일부 고령층은 AI 기기를 직접 체험하고, 약 알림, 뉴스 듣기 등 일상에 활용하기 시작합니다.");
        elderly.push("경로당, 동년배 모임 등에서 긍정적 입소문이 확산됩니다.");
    }
    if (strategyText.match(/말 한 마디로|심리적 안정감|고독감/)) {
        elderly.push("쉬운 메시지와 심리적 안정감 강조로 심리적 장벽이 완화됩니다.");
    }
    if (elderly.length === 0) {
        elderly.push("고령층은 새로운 기술에 대한 호기심과 함께, 실제 사용 사례를 통해 점차 긍정적으로 반응합니다.");
    }
    // 사회 변화
    social.push("고령층의 AI 활용률이 증가하며 디지털 소외가 일부 해소됩니다.");
    social.push("가족, 사회에서 고령층의 디지털 적응에 대한 긍정적 여론이 형성됩니다.");
    social.push("AI 기기 및 서비스 시장이 성장하고, 관련 정책이 확대됩니다.");
    return {elderly, social};
}

// 타겟 고객별 자연어 반응 생성 함수 (트렌드별 구체적 예시 추가)
function getTargetCustomerReactions(targetCustomer) {
    const reactions = [];
    const lower = targetCustomer.toLowerCase();
    if (/mz|mz세대|mz generation/.test(lower)) {
        reactions.push("MZ 세대는 트렌드와 개성을 중시하며, SNS에서 본 한정판 패션, 프리미엄 취미, 디지털 기기, 여행 등 자기표현형 소비에 적극적으로 반응합니다. 예: 20대 대학생은 SNS에서 본 패션 아이템을 친구들과 공유하며 브랜드 호감도가 높아집니다.");
    }
    if (/50대|60대|70대|독거노인|만성질환/.test(lower)) {
        reactions.push("50대~70대, 특히 독거노인 및 만성질환 환자는 건강과 안전에 대한 관심이 높으며, 실질적인 혜택과 신뢰성 있는 정보에 긍정적으로 반응합니다. 맞춤형 서비스에 특히 호응할 수 있습니다.");
    }
    if (/40대|50대.*자녀|부모.*건강/.test(lower)) {
        reactions.push("40~50대 중 부모의 건강을 책임지는 자녀는 실용성과 신뢰성을 중시하며, 가족의 건강에 도움이 되는 제품/서비스에 적극적으로 관심을 보입니다.");
    }
    if (/고령층|노년층/.test(lower)) {
        reactions.push("고령층은 새로운 기술에 대한 호기심과 함께, 실제 사용 사례를 통해 점차 긍정적으로 반응합니다. 쉬운 사용법과 심리적 안정감이 중요합니다.");
    }
    if (/글로벌|global/.test(lower)) {
        reactions.push("글로벌 기업은 혁신성과 지속 가능성, 사회적 책임을 중시하며, ESG(환경·사회·지배구조) 요소가 강조된 전략에 긍정적으로 반응합니다.");
    }
    if (/환경|친환경|eco|environment/.test(lower)) {
        reactions.push("환경을 생각하는 소비자는 친환경 소재, 지속 가능한 생산, 사회적 가치에 민감하게 반응하며, 브랜드의 친환경 메시지에 높은 호응을 보입니다.");
    }
    if (/모든 소비자|전체|everyone|all/.test(lower)) {
        reactions.push("대중적인 전략은 다양한 연령과 계층의 소비자에게 고르게 긍정적인 반응을 이끌어낼 수 있습니다.");
    }
    // 트렌드별 추가
    if (/육아|부모|아이|유아|어린이/.test(lower)) {
        reactions.push("육아로 바쁜 부모는 간편식 유아식, 자동 육아용품, 렌탈/구독 서비스, 교육비 절감형 상품, 프리미엄 유아식, 맞춤형 교육 콘텐츠에 큰 관심을 보입니다. 예: 워킹맘은 자동 분유 제조기와 유아식 구독 서비스를 적극적으로 이용합니다.");
    }
    if (/1인|혼족|욜로/.test(lower)) {
        reactions.push("1인 가구, 욜로족 등은 나 자신에게 투자하는 프리미엄 소형 가전, 1인 여행, 간편식, 구독 서비스, 스마트홈 기기 등에 높은 관심을 보입니다. 예: 30대 싱글은 1인용 스마트밥솥과 프리미엄 취미 클래스에 투자합니다.");
    }
    if (/딩크|dink/.test(lower)) {
        reactions.push("딩크족은 미래에 대한 불안감 해소와 자산 관리, 프리미엄 육아용품, 맞춤형 금융 상품, 투자 컨설팅, 고급 취미 클래스 등에 적극적으로 반응합니다. 예: 맞벌이 부부는 자산관리 컨설팅과 프리미엄 유아교육 콘텐츠에 투자합니다.");
    }
    if (/펫|반려동물|펫팸|pet/.test(lower)) {
        reactions.push("펫팸족은 반려동물을 가족처럼 여기며, 프리미엄 펫푸드, 펫 용품, 펫 보험, 펫 호텔, 펫 장례 서비스 등 반려동물 관련 프리미엄 시장에 큰 관심을 보입니다. 예: 40대 싱글은 반려견을 위해 펫 호텔과 펫 보험을 적극적으로 이용합니다.");
    }
    // 기본 반응(매칭되는 타겟이 없을 때)
    if (reactions.length === 0) {
        reactions.push("타겟 고객은 마케팅 전략에 따라 다양한 반응을 보일 수 있습니다. 맞춤형 접근이 중요합니다.");
    }
    return reactions;
}

// 시뮬레이션 결과 표시
function displaySimulationResults(results, period, budget) {
    const simulationSection = document.querySelector('#simulation');
    if (!simulationSection) return;
    // 기존 결과 제거
    const existingResults = simulationSection.querySelector('.simulation-results');
    if (existingResults) {
        existingResults.remove();
    }
    // 전략 텍스트 추출(입력 폼에서)
    const strategyText = document.getElementById('strategyInput')?.value || '';
    const reaction = getElderlyAndSocialReaction(strategyText);
    // 타겟 고객 반응 추가
    const targetCustomer = document.getElementById('targetCustomer')?.value || '';
    const targetReactions = getTargetCustomerReactions(targetCustomer);
    // 결과 컨테이너 생성
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'simulation-results mt-4';
    resultsContainer.innerHTML = `
        <div class="card">
            <div class="card-body">
                <h4 class="card-title">시뮬레이션 결과</h4>
                <div class="progress mb-3">
                    <div class="progress-bar" role="progressbar" 
                         style="width: ${results.probability * 100}%" 
                         aria-valuenow="${results.probability * 100}" 
                         aria-valuemin="0" 
                         aria-valuemax="100">
                        ${Math.round(results.probability * 100)}% 구매 확률
                    </div>
                </div>
                <canvas id="resultChart" height="100"></canvas>
                <h5 class="mt-4">주요 영향 요인:</h5>
                <ul class="list-group">
                    ${results.factors.map(factor => `
                        <li class="list-group-item">${factor}</li>
                    `).join('')}
                </ul>
                <div class="mt-3">
                    <h5>타겟 고객의 반응:</h5>
                    <ul>${targetReactions.map(item => `<li>${item}</li>`).join('')}</ul>
                    <h5>고령층의 반응:</h5>
                    <ul>${reaction.elderly.map(item => `<li>${item}</li>`).join('')}</ul>
                    <h5>사회적 변화:</h5>
                    <ul>${reaction.social.map(item => `<li>${item}</li>`).join('')}</ul>
                </div>
                <div class="mt-3">
                    <h5>시뮬레이션 설정:</h5>
                    <p>기간: ${period}개월</p>
                    <p>예산: ${budget}만원</p>
                </div>
            </div>
        </div>
    `;
    simulationSection.appendChild(resultsContainer);
    // 차트 데이터 준비 및 그리기
    drawResultChart(results, period, budget);
}

function drawResultChart(results, period, budget) {
    const ctx = document.getElementById('resultChart').getContext('2d');
    // 예시: 예산에 따른 구매확률 변화 (단순 선형 증가 가정)
    const budgets = [100, 300, 500, 700, 1000, 1500, 2000];
    const probabilities = budgets.map(b => {
        // 베이지안 네트워크를 활용해 각 예산별 확률 계산
        const network = new BayesianNetwork();
        const persona = document.querySelector('.persona-template.selected');
        const personaName = persona ? persona.querySelector('h5').textContent : '';
        const personaObj = personaTemplates.find(t => t.name === personaName);
        return network.simulatePurchaseDecision(personaObj, b).probability;
    });
    if (window.resultChartInstance) {
        window.resultChartInstance.destroy();
    }
    window.resultChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: budgets.map(b => b + '만원'),
            datasets: [{
                label: '예산별 구매 확률',
                data: probabilities.map(p => Math.round(p * 100)),
                borderColor: '#007bff',
                backgroundColor: 'rgba(0,123,255,0.1)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: { display: true, text: '구매 확률(%)' }
                }
            },
            plugins: {
                legend: { display: true }
            }
        }
    });
}
// 소비자 행동 모델 초기화
function initializeBehaviorModel() {
    const purchaseFrequency = document.getElementById('purchaseFrequency');
const priceSensitivity = document.getElementById('priceSensitivity');
const brandLoyalty = document.getElementById('brandLoyalty');

[purchaseFrequency, priceSensitivity, brandLoyalty].forEach(element => {
    if (element) { //
        element.addEventListener('change', updateBehaviorModel);
    }
});
}

// 행동 모델 업데이트
function updateBehaviorModel() {
    const purchaseFrequency = document.getElementById('purchaseFrequency').value;
    const priceSensitivity = document.getElementById('priceSensitivity').value;
    const brandLoyalty = document.getElementById('brandLoyalty').value;

    // 베이지안 네트워크에 행동 모델 업데이트
    const network = new BayesianNetwork();
    network.updateBehaviorModel({
        purchaseFrequency,
        priceSensitivity,
        brandLoyalty
    });
}

// 예산 분배 초기화
/*
function initializeBudgetAllocation() {
    const sliders = document.querySelectorAll('.budget-allocation input[type="range"]');
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            updateBudgetAllocation();
        });
    });
}
*/
// 예산 분배 업데이트
function updateBudgetAllocation() {
    const digital = document.getElementById('digitalMarketing').value;
    const offline = document.getElementById('offlineMarketing').value;
    const content = document.getElementById('contentMarketing').value;

    // 예산 값 표시 업데이트
    document.querySelectorAll('.budget-value').forEach((span, index) => {
        const values = [digital, offline, content];
        span.textContent = `${values[index]}%`;
    });
//
    // 총 예산이 100%가 되도록 조정
    const total = parseInt(digital) + parseInt(offline) + parseInt(content);
    if (total !== 100) {
        const diff = total - 100;
        const lastSlider = document.getElementById('contentMarketing');
        lastSlider.value = parseInt(lastSlider.value) - diff;
        document.querySelectorAll('.budget-value')[2].textContent = `${lastSlider.value}%`;
    }
}

// 캠페인 계획 초기화
function initializeCampaignPlanning() {
    const startDate = document.getElementById('campaignStart');
    const endDate = document.getElementById('campaignEnd');
    const goal = document.getElementById('campaignGoal');

    // 기본 날짜 설정
    const today = new Date();
    startDate.value = today.toISOString().split('T')[0];
    today.setMonth(today.getMonth() + 1);
    endDate.value = today.toISOString().split('T')[0];

    // 이벤트 리스너
    [startDate, endDate, goal].forEach(element => {
        element.addEventListener('change', updateCampaignPlan);
    });
}

// 캠페인 계획 업데이트
function updateCampaignPlan() {
    const startDate = new Date(document.getElementById('campaignStart').value);
    const endDate = new Date(document.getElementById('campaignEnd').value);
    const goal = document.getElementById('campaignGoal').value;

    // 캠페인 기간 검증
    if (endDate < startDate) {
        alert('종료일은 시작일보다 이후여야 합니다.');
        document.getElementById('campaignEnd').value = startDate.toISOString().split('T')[0];
        return;
    }

    // 캠페인 목표에 따른 전략 업데이트
    updateStrategyByGoal(goal);
}

// 목표별 전략 업데이트
function updateStrategyByGoal(goal) {
    const network = new BayesianNetwork();
    switch(goal) {
        case 'awareness':
            network.updateStrategy({ marketingFocus: 'brand', budgetRatio: 0.6 });
            break;
        case 'conversion':
            network.updateStrategy({ marketingFocus: 'sales', budgetRatio: 0.7 });
            break;
        case 'retention':
            network.updateStrategy({ marketingFocus: 'loyalty', budgetRatio: 0.5 });
            break;
    }
}

// 분석 초기화
function initializeAnalysis() {
    initializeSensitivityChart();
    initializeCLVChart();
}

// 민감도 분석 차트 초기화
function initializeSensitivityChart() {
    const ctx = document.getElementById('sensitivityChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['가격', '브랜드', '마케팅', '품질'],
            datasets: [{
                label: '영향도',
                data: [0.3, 0.25, 0.25, 0.2],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)'
                ]
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    max: 1
                }
            }
        }
    });
}

// CLV 차트 초기화
function initializeCLVChart() {
    const ctx = document.getElementById('clvChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1년차', '2년차', '3년차', '4년차', '5년차'],
            datasets: [{
                label: '고객 생애 가치',
                data: [100, 150, 200, 250, 300],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 커스텀 폼 표시
function showCustomizeForm() {
    const customizeForm = document.querySelector('.persona-customize');
    customizeForm.style.display = 'block';
    
    // MZ세대 기본값 설정
    document.getElementById('generation').value = 'mz';
    document.getElementById('traitUnique').checked = true;
    document.getElementById('traitValue').checked = true;
    document.getElementById('factorReview').checked = true;
    document.getElementById('channelOnline').checked = true;
    document.getElementById('channelSocial').checked = true;
}

// 커스텀 페르소나 저장
function saveCustomPersona() {
    const generation = document.getElementById('generation').value;
    const traits = getSelectedTraits();
    const factors = getSelectedFactors();
    const channels = getSelectedChannels();

    // 커스텀 페르소나 생성
    const customPersona = {
        id: Date.now(),
        name: `${generation === 'mz' ? 'MZ' : generation === 'x' ? 'X' : '베이비부머'} 세대 커스텀`,
        age: getAgeRange(generation),
        income: getIncomeRange(generation),
        interests: getInterests(traits),
        behavior: getBehavior(traits, factors, channels),
        customData: {
            generation,
            traits,
            factors,
            channels
        }
    };

    // 템플릿 목록에 추가
    const templateList = document.querySelector('.template-options');
    const templateDiv = document.createElement('div');
    templateDiv.className = 'persona-template';
    templateDiv.innerHTML = `
        <h5>${customPersona.name}</h5>
        <p>연령: ${customPersona.age}</p>
        <p>소득: ${customPersona.income}</p>
        <p>관심사: ${customPersona.interests.join(', ')}</p>
        <p>구매 행동: ${customPersona.behavior}</p>
    `;
    templateDiv.addEventListener('click', () => selectTemplate(templateDiv, customPersona));
    
    // 커스텀 버튼 앞에 삽입
    const customButton = templateList.querySelector('.btn-outline-primary');
    templateList.insertBefore(templateDiv, customButton);

    // 커스텀 폼 숨기기
    document.querySelector('.persona-customize').style.display = 'none';

    // 자동으로 새로 생성된 페르소나 선택
    selectTemplate(templateDiv, customPersona);
}

// 선택된 특성 가져오기
function getSelectedTraits() {
    const traits = [];
    if (document.getElementById('traitUnique').checked) traits.push('unique');
    if (document.getElementById('traitValue').checked) traits.push('value');
    if (document.getElementById('traitTrend').checked) traits.push('trend');
    if (document.getElementById('traitQuality').checked) traits.push('quality');
    return traits;
}

// 선택된 구매 요인 가져오기
function getSelectedFactors() {
    const factors = [];
    if (document.getElementById('factorBrand').checked) factors.push('brand');
    if (document.getElementById('factorPrice').checked) factors.push('price');
    if (document.getElementById('factorReview').checked) factors.push('review');
    if (document.getElementById('factorDesign').checked) factors.push('design');
    return factors;
}

// 선택된 채널 가져오기
function getSelectedChannels() {
    const channels = [];
    if (document.getElementById('channelOnline').checked) channels.push('online');
    if (document.getElementById('channelOffline').checked) channels.push('offline');
    if (document.getElementById('channelSocial').checked) channels.push('social');
    return channels;
}

// 세대별 연령대 반환
function getAgeRange(generation) {
    switch(generation) {
        case 'mz': return '20-40';
        case 'x': return '40-55';
        case 'boomer': return '55-75';
        default: return '20-40';
    }
}

// 세대별 소득 범위 반환
function getIncomeRange(generation) {
    switch(generation) {
        case 'mz': return '연 3천만원 이상';
        case 'x': return '연 5천만원 이상';
        case 'boomer': return '연 4천만원 이상';
        default: return '연 3천만원 이상';
    }
}

// 특성에 따른 관심사 반환
function getInterests(traits) {
    const interests = [];
    if (traits.includes('unique')) interests.push('개성있는 제품');
    if (traits.includes('value')) interests.push('가성비');
    if (traits.includes('trend')) interests.push('최신 트렌드');
    if (traits.includes('quality')) interests.push('품질');
    return interests;
}

// 특성과 요인에 따른 구매 행동 반환
function getBehavior(traits, factors, channels) {
    const behaviors = [];
    
    if (traits.includes('unique')) behaviors.push('독특한 제품 선호');
    if (traits.includes('value')) behaviors.push('가성비 중시');
    if (traits.includes('trend')) behaviors.push('트렌드 추종');
    if (traits.includes('quality')) behaviors.push('품질 중시');
    
    if (factors.includes('review')) behaviors.push('리뷰 중요시');
    if (factors.includes('brand')) behaviors.push('브랜드 가치 중시');
    
    if (channels.includes('social')) behaviors.push('소셜 커머스 선호');
    if (channels.includes('online')) behaviors.push('온라인 쇼핑 선호');
    
    return behaviors.join(', ');
}

// 마케팅 전략 초기화
function initializeMarketingStrategy() {
    const strategySection = document.getElementById('strategy-section');
    
    // 예산 할당
    const budgetAllocation = document.createElement('div');
    budgetAllocation.className = 'strategy-item';
    budgetAllocation.innerHTML = `
        <h3>예산 할당</h3>
        <div class="budget-sliders">
            <div class="slider-item">
                <label>SNS 마케팅</label>
                <input type="range" min="0" max="100" value="40" class="budget-slider" data-channel="sns">
                <span class="budget-value">40%</span>
            </div>
            <div class="slider-item">
                <label>인플루언서 마케팅</label>
                <input type="range" min="0" max="100" value="30" class="budget-slider" data-channel="influencer">
                <span class="budget-value">30%</span>
            </div>
            <div class="slider-item">
                <label>학교 내 홍보</label>
                <input type="range" min="0" max="100" value="30" class="budget-slider" data-channel="school">
                <span class="budget-value">30%</span>
            </div>
        </div>
    `;
    
    // 캠페인 계획
    const campaignPlanning = document.createElement('div');
    campaignPlanning.className = 'strategy-item';
    campaignPlanning.innerHTML = `
        <h3>캠페인 계획</h3>
        <div class="campaign-options">
            <div class="option-group">
                <label>캠페인 목표</label>
                <select id="campaign-goal">
                    <option value="awareness">인지도 향상</option>
                    <option value="engagement">참여도 증가</option>
                    <option value="sales">판매 증대</option>
                </select>
            </div>
            <div class="option-group">
                <label>캠페인 기간</label>
                <select id="campaign-duration">
                    <option value="1">1주일</option>
                    <option value="2">2주일</option>
                    <option value="4">1개월</option>
                </select>
            </div>
            <div class="option-group">
                <label>캠페인 채널</label>
                <div class="channel-checkboxes">
                    <label><input type="checkbox" value="instagram" checked> 인스타그램</label>
                    <label><input type="checkbox" value="youtube"> 유튜브</label>
                    <label><input type="checkbox" value="school"> 학교 내</label>
                </div>
            </div>
        </div>
    `;
    
    strategySection.appendChild(budgetAllocation);
    strategySection.appendChild(campaignPlanning);
    
    // 예산 슬라이더 이벤트 리스너
    document.querySelectorAll('.budget-slider').forEach(slider => {
        slider.addEventListener('input', function() {
            updateBudgetAllocation();
        });
    });
    
    // 캠페인 옵션 이벤트 리스너
    document.getElementById('campaign-goal').addEventListener('change', updateCampaignPlan);
    document.getElementById('campaign-duration').addEventListener('change', updateCampaignPlan);
    document.querySelectorAll('.channel-checkboxes input').forEach(checkbox => {
        checkbox.addEventListener('change', updateCampaignPlan);
    });
}

// 마케팅 전략 시뮬레이션 함수 (트렌드 전략 반영)
function simulateMarket(strategy) {
  // 기본 구매율(%) 설정
  let elderly = 10;
  let caregiver = 15;
  let single = 12;
  let dink = 10;
  let petfam = 8;

  // 전략에 따른 가중치 적용
  if (/육아|유아|부모|아이|어린이|간편식/.test(strategy.message)) {
    caregiver += 15;
    elderly += 3;
  }
  if (/렌탈|구독/.test(strategy.message)) {
    caregiver += 5;
    single += 7;
    dink += 5;
  }
  if (/1인|혼족|욜로/.test(strategy.message)) {
    single += 15;
    dink += 7;
  }
  if (/딩크|자산|투자|노후|금융/.test(strategy.message)) {
    dink += 15;
    single += 3;
  }
  if (/펫|반려동물|펫팸|펫푸드|펫 용품|펫 보험|펫 호텔/.test(strategy.message)) {
    petfam += 20;
    single += 5;
    dink += 5;
  }
  if (/교육|코딩|영재|AI|맞춤|돌봄/.test(strategy.message)) {
    caregiver += 10;
    dink += 5;
  }
  if (strategy.channel === "오프라인") {
    elderly += 5;
  }
  if (strategy.channel === "온라인") {
    caregiver += 7;
    single += 5;
    dink += 3;
    petfam += 2;
  }
  if (strategy.price < 30000) {
    elderly += 5;
    caregiver += 3;
    single += 2;
    dink += 2;
    petfam += 2;
  }
  if (strategy.promotion) {
    elderly += 3;
    caregiver += 2;
    single += 2;
    dink += 2;
    petfam += 2;
  }

  // 사회적 반응(긍정/부정 비율)
  let positive = Math.round((elderly + caregiver + single + dink + petfam) / 5);
  let negative = 100 - positive;

  return {
    elderly,
    caregiver,
    single,
    dink,
    petfam,
    positive,
    negative
  };
}

// 사용 예시
const strategy = {
  message: "관절 건강, 면역력 강화",
  channel: "오프라인",
  price: 25000,
  promotion: true
};

const result = simulateMarket(strategy);
console.log(result);
// { elderly: 28, caregiver: 20, positive: 24, negative: 76 }

// 여러 마케팅 목표 해석 함수 (정량/정성 모두 지원)
function describeMultipleGoals(goalText, result, target) {
    const goals = goalText.split(/,|\n/).map(g => g.trim()).filter(Boolean);
    return goals.map(goal => {
        const match = goal.match(/([0-9]+)%/);
        const goalValue = match ? parseInt(match[1], 10) : null;
        let achieved = null;
        if (/인지도/.test(goal)) achieved = result.positive;
        else if (/매출/.test(goal)) achieved = result.sales || result.positive;
        else if (/만족도/.test(goal)) achieved = result.satisfaction || result.positive;
        else if (/고령층|AI|우울증/.test(goal)) achieved = result.elderly;
        else if (/저출산|육아|유아|부모|아이|어린이/.test(goal)) achieved = result.caregiver;
        else if (/1인|혼족|욜로/.test(goal)) achieved = result.single;
        else if (/딩크|자산|투자|노후|금융/.test(goal)) achieved = result.dink;
        else if (/펫|반려동물|펫팸|pet/.test(goal)) achieved = result.petfam;
        else achieved = result.positive;
        // 자연어 예시 및 시나리오 추가
        let scenario = '';
        if (/저출산|육아|유아|부모|아이|어린이/.test(goal)) {
            scenario = `육아 지원 정책 확대, 유아식·육아용품 시장 성장, 맞벌이 가정의 시간 절약형 서비스 확산 등 긍정적 변화가 기대됩니다. 예: 워킹맘 김OO님은 간편식 유아식과 자동 육아용품 덕분에 육아 부담이 크게 줄었습니다.`;
        } else if (/1인|혼족|욜로/.test(goal)) {
            scenario = `1인 가구를 위한 소형가전, 간편식, 구독 서비스, 1인 여행 패키지 등 프리미엄 제품/서비스 시장이 성장할 것으로 예측됩니다. 예: 30대 직장인 이OO씨는 1인용 스마트밥솥과 프리미엄 취미 클래스에 투자하며 삶의 만족도를 높이고 있습니다.`;
        } else if (/딩크|자산|투자|노후|금융/.test(goal)) {
            scenario = `딩크족을 위한 맞춤형 금융 상품, 프리미엄 육아용품, 고급 취미 시장이 확대될 것입니다. 예: 맞벌이 부부 박OO씨는 자산관리 컨설팅과 프리미엄 유아교육 콘텐츠에 적극적으로 투자하고 있습니다.`;
        } else if (/펫|반려동물|펫팸|pet/.test(goal)) {
            scenario = `펫팸족을 위한 프리미엄 펫푸드, 펫 용품, 펫 보험, 펫 호텔, 펫 장례 서비스 등 반려동물 시장이 크게 성장할 것입니다. 예: 40대 싱글 김OO씨는 반려견을 위해 펫 호텔과 펫 보험을 적극적으로 이용하고 있습니다.`;
        } else if (/mz|mz세대|mz generation|패션|옷|트렌드/.test(goal) || /mz|mz세대|mz generation|패션|옷|트렌드/.test(target)) {
            scenario = `MZ세대의 패션, 취미, 디지털, 여행 등 자기표현형 소비가 증가하며, 관련 브랜드 매출이 상승할 것입니다. 예: 20대 대학생 최OO씨는 SNS에서 본 한정판 패션 아이템을 구매하고, 친구들과 공유하며 브랜드 호감도가 높아집니다.`;
        } else {
            scenario = `다양한 고객군이 ${goal} 목표에 긍정적으로 반응할 것으로 예측됩니다.`;
        }
        if (goalValue) {
            const percent = Math.round((achieved / goalValue) * 100);
            if (achieved >= goalValue) {
                return `“${goal}” 목표에 대해 예측 수치가 ${achieved}%로 목표(${goalValue}%)를 달성 또는 초과하였습니다. ${scenario}`;
            } else if (percent >= 80) {
                return `“${goal}” 목표에 대해 예측 수치가 ${achieved}%로 목표(${goalValue}%)에 근접하였습니다(달성률 약 ${percent}%). ${scenario}`;
            } else {
                return `“${goal}” 목표에 대해 예측 수치가 ${achieved}%로, 추가적인 노력이 필요합니다. ${scenario}`;
            }
        }
        // 정성적(서술형) 목표 해석 + 예시
        return describeQualitativeGoal(goal, result, target) + ' ' + scenario;
    });
}

function describeQualitativeGoal(goal, result, target) {
    if (/개인화|공유|커뮤니티/.test(goal)) {
        return "소비자들은 개인화된 경험과 공유 경제, 커뮤니티 가치에 긍정적으로 반응할 것으로 예측됩니다.";
    }
    if (/건강|돌봄|신뢰/.test(goal)) {
        return "지역 사회 내 신뢰도와 건강/돌봄 서비스에 대한 인식이 향상될 것으로 기대됩니다.";
    }
    if (/고령층|AI|우울증/.test(goal)) {
        return "고령층의 AI에 대한 긍정적 인식이 증가하고, 노인 우울증 감소에도 긍정적 영향을 미칠 수 있습니다.";
    }
    if (/글로벌|파트너쉽|친환경/.test(goal)) {
        return "글로벌 기업과의 파트너십 및 친환경 브랜드 이미지가 효과적으로 전달될 것으로 예측됩니다.";
    }
    if (/콘텐츠|에이전시/.test(goal)) {
        return "콘텐츠 마케팅과 AI 에이전시 활용으로 브랜드 인지도와 소비자 참여도가 향상될 것입니다.";
    }
    // 기본
    return `“${goal}” 목표에 대해 긍정적인 변화가 기대됩니다.`;
}

// [추가] 전략별 매출 영향 분석 함수 (전략 메시지와 타겟에 따라 브랜드/상품 다양화)
function getBrandSalesImpact(strategies) {
    // 키워드별 브랜드/상품 매핑
    const mapping = [
        {
            keywords: ['육아', '유아', '부모', '아이', '어린이', '간편식', '자동', '교육', '돌봄'],
            brands: ['베베쿡', '일동후디스', '유한킴벌리(기저귀)', '스토케(유모차)', '맘스맘', '프뢰벨(교육)', '웅진북클럽', '쿠쿠(유아가전)']
        },
        {
            keywords: ['1인', '혼족', '욜로', '프리미엄', '소형', '간편식', '구독', '스마트홈', '여행', '취미'],
            brands: ['쿠쿠(소형가전)', '삼성 비스포크', 'GS리테일(간편식)', '마켓컬리', '클래스101(취미)', '여기어때', '에어비앤비', '밀리의서재(구독)']
        },
        {
            keywords: ['딩크', '자산', '투자', '노후', '금융', '맞벌이', '고급', '컨설팅'],
            brands: ['삼성생명', '미래에셋', '신한은행', '프리미엄 유아교육', '삼성카드(프리미엄)', '클래스101(고급취미)']
        },
        {
            keywords: ['펫', '반려동물', '펫팸', '펫푸드', '펫 용품', '펫 보험', '펫 호텔', '펫 장례'],
            brands: ['로얄캐닌', '네츄럴코어', '펫프렌즈', '삼성화재(펫보험)', '펫츠비(호텔)', '펫포레스트(장례)']
        },
        {
            keywords: ['mz', 'mz세대', '패션', '옷', '트렌드', '디지털', '여행', '취미'],
            brands: ['무신사', '29CM', '나이키', '아디다스', '애플', '삼성전자', '여기어때', '클래스101']
        },
        {
            keywords: ['복지관', '병원', '약국', '교회', '상담 부스', '쿠폰', '청소년', '노년', '협약', '마트'],
            brands: ['종근당', '유한양행', '한미약품', '지역마트', '오뚜기(건강식품)']
        },
        {
            keywords: ['AI', '음성', '지하철', '버스', '경로당', '포스터', '알림'],
            brands: ['삼성(SmartThings)', 'LG(ThinQ)', 'SKT 누구', 'KT 기가지니', '구글', '애플(Siri)']
        },
        {
            keywords: ['콘텐츠', 'SEO', '검색', '자동화', '마케팅 프로세스', '빅데이터', '키워드', '브레인스토밍'],
            brands: ['네이버', '구글', '유튜브', '카카오', '메타(페이스북/인스타그램)']
        }
    ];
    return strategies.map((strategy, idx) => {
        let found = [];
        mapping.forEach(map => {
            if (map.keywords.some(kw => strategy.includes(kw))) {
                found = found.concat(map.brands);
            }
        });
        if (found.length === 0) found = ['(특정 브랜드 영향 없음)'];
        return `전략 ${idx+1}: ${found.join(', ')}의 매출이 상승할 것으로 예측됩니다.`;
    });
}