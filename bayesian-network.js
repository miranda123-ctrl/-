class BayesianNetwork {
    constructor() {
        this.nodes = {
            '구매빈도': {
                states: ['낮음', '중간', '높음'],
                probabilities: {
                    '낮음': 0.4,
                    '중간': 0.4,
                    '높음': 0.2
                }
            },
            '가격민감도': {
                states: ['낮음', '중간', '높음'],
                probabilities: {
                    '낮음': 0.2,
                    '중간': 0.3,
                    '높음': 0.5
                }
            },
            '브랜드충성도': {
                states: ['낮음', '중간', '높음'],
                probabilities: {
                    '낮음': 0.5,
                    '중간': 0.3,
                    '높음': 0.2
                }
            },
            '구매결정요인': {
                states: ['가격', '친구추천', '리뷰', '디자인'],
                probabilities: {
                    '가격': 0.4,
                    '친구추천': 0.3,
                    '리뷰': 0.2,
                    '디자인': 0.1
                }
            },
            '채널선호도': {
                states: ['온라인', '오프라인', '소셜커머스'],
                probabilities: {
                    '온라인': 0.4,
                    '오프라인': 0.3,
                    '소셜커머스': 0.3
                }
            }
        };
        this.initializeNetwork();
    }

    initializeNetwork() {
        // 구매 의사결정에 영향을 미치는 노드들 정의
        this.nodes.set('product_quality', {
            states: ['high', 'medium', 'low'],
            probabilities: [0.3, 0.5, 0.2]
        });

        this.nodes.set('price', {
            states: ['expensive', 'moderate', 'cheap'],
            probabilities: [0.2, 0.5, 0.3]
        });

        this.nodes.set('brand_reputation', {
            states: ['excellent', 'good', 'average'],
            probabilities: [0.2, 0.4, 0.4]
        });

        this.nodes.set('marketing_effect', {
            states: ['high', 'medium', 'low'],
            probabilities: [0.3, 0.4, 0.3]
        });

        // 구매 의사결정 노드 (다른 노드들에 의존)
        this.nodes.set('purchase_decision', {
            states: ['buy', 'consider', 'reject'],
            dependencies: ['product_quality', 'price', 'brand_reputation', 'marketing_effect'],
            conditionalProbabilities: this.generateConditionalProbabilities()
        });
    }

    generateConditionalProbabilities() {
        // 실제 구현에서는 더 복잡한 조건부 확률 테이블이 필요합니다
        return {
            'high,expensive,excellent,high': [0.8, 0.15, 0.05],
            'high,moderate,excellent,high': [0.9, 0.08, 0.02],
            'high,cheap,excellent,high': [0.95, 0.04, 0.01],
            // ... 더 많은 조합들
        };
    }

    simulatePurchaseDecision(persona, marketingBudget) {
        // 페르소나 특성에 따른 확률 조정
        const adjustedProbabilities = this.adjustProbabilitiesForPersona(persona, marketingBudget);
        
        // 베이지안 추론을 통한 구매 확률 계산
        const purchaseProbability = this.calculatePurchaseProbability(adjustedProbabilities);
        
        return {
            probability: purchaseProbability,
            factors: this.analyzeFactors(adjustedProbabilities)
        };
    }

    adjustProbabilitiesForPersona(persona, marketingBudget) {
        const adjusted = {};
        
        // 페르소나 특성에 따른 확률 조정
        switch(persona.name) {
            case '젊은 전문가':
                adjusted.price = this.adjustPriceSensitivity(0.7); // 가격 민감도 낮음
                adjusted.brand = this.adjustBrandSensitivity(0.8); // 브랜드 중요도 높음
                break;
            case '가족 중심 소비자':
                adjusted.price = this.adjustPriceSensitivity(0.9); // 가격 민감도 높음
                adjusted.brand = this.adjustBrandSensitivity(0.6); // 브랜드 중요도 중간
                break;
            case '은퇴 준비 세대':
                adjusted.price = this.adjustPriceSensitivity(0.5); // 가격 민감도 매우 낮음
                adjusted.brand = this.adjustBrandSensitivity(0.9); // 브랜드 중요도 매우 높음
                break;
        }

        // 마케팅 예산에 따른 효과 조정
        adjusted.marketing = this.adjustMarketingEffect(marketingBudget);

        return adjusted;
    }

    adjustPriceSensitivity(sensitivity) {
        return {
            expensive: 0.2 * sensitivity,
            moderate: 0.5,
            cheap: 0.3 * (2 - sensitivity)
        };
    }

    adjustBrandSensitivity(sensitivity) {
        return {
            excellent: 0.3 * sensitivity,
            good: 0.4,
            average: 0.3 * (2 - sensitivity)
        };
    }

    adjustMarketingEffect(budget) {
        const normalizedBudget = Math.min(budget / 1000, 1); // 예산을 0-1 사이로 정규화
        return {
            high: 0.3 + (0.2 * normalizedBudget),
            medium: 0.4,
            low: 0.3 - (0.2 * normalizedBudget)
        };
    }

    calculatePurchaseProbability(adjustedProbabilities) {
        // 실제 구현에서는 더 복잡한 베이지안 추론이 필요합니다
        let totalProbability = 0;
        let weightSum = 0;

        for (const [factor, probabilities] of Object.entries(adjustedProbabilities)) {
            const weight = this.getFactorWeight(factor);
            totalProbability += probabilities.high * weight;
            weightSum += weight;
        }

        return totalProbability / weightSum;
    }

    getFactorWeight(factor) {
        const weights = {
            price: 0.3,
            brand: 0.25,
            marketing: 0.25,
            quality: 0.2
        };
        return weights[factor] || 0.25;
    }

    analyzeFactors(adjustedProbabilities) {
        const factors = [];
        for (const [factor, probabilities] of Object.entries(adjustedProbabilities)) {
            if (probabilities.high > 0.6) {
                factors.push(`${factor}가 구매 결정에 강한 영향을 미칩니다.`);
            }
        }
        return factors;
    }

    // 행동 모델 업데이트
    updateBehaviorModel(behavior) {
        // 구매빈도 업데이트
        if (behavior.purchaseFrequency) {
            this.nodes['구매빈도'].probabilities = {
                '낮음': behavior.purchaseFrequency === 'low' ? 0.6 : 0.2,
                '중간': behavior.purchaseFrequency === 'medium' ? 0.6 : 0.2,
                '높음': behavior.purchaseFrequency === 'high' ? 0.6 : 0.2
            };
        }

        // 가격민감도 업데이트
        if (behavior.priceSensitivity) {
            this.nodes['가격민감도'].probabilities = {
                '낮음': behavior.priceSensitivity === 'low' ? 0.6 : 0.2,
                '중간': behavior.priceSensitivity === 'medium' ? 0.6 : 0.2,
                '높음': behavior.priceSensitivity === 'high' ? 0.6 : 0.2
            };
        }

        // 브랜드충성도 업데이트
        if (behavior.brandLoyalty) {
            this.nodes['브랜드충성도'].probabilities = {
                '낮음': behavior.brandLoyalty === 'low' ? 0.6 : 0.2,
                '중간': behavior.brandLoyalty === 'medium' ? 0.6 : 0.2,
                '높음': behavior.brandLoyalty === 'high' ? 0.6 : 0.2
            };
        }

        // 구매결정요인 업데이트
        if (behavior.purchaseFactors) {
            const factors = behavior.purchaseFactors;
            this.nodes['구매결정요인'].probabilities = {
                '가격': factors.includes('price') ? 0.4 : 0.1,
                '친구추천': factors.includes('friend') ? 0.3 : 0.1,
                '리뷰': factors.includes('review') ? 0.2 : 0.1,
                '디자인': factors.includes('design') ? 0.1 : 0.1
            };
        }

        // 채널선호도 업데이트
        if (behavior.channelPreference) {
            const channels = behavior.channelPreference;
            this.nodes['채널선호도'].probabilities = {
                '온라인': channels.includes('online') ? 0.4 : 0.1,
                '오프라인': channels.includes('offline') ? 0.3 : 0.1,
                '소셜커머스': channels.includes('social') ? 0.3 : 0.1
            };
        }
    }

    // 전략 업데이트
    updateStrategy(strategy) {
        const { marketingFocus, budgetRatio } = strategy;
        
        // 마케팅 초점에 따른 확률 조정
        this.nodes.get('marketing_effect').probabilities = this.calculateMarketingEffect(
            marketingFocus,
            budgetRatio
        );
    }

    // 마케팅 효과 계산
    calculateMarketingEffect(focus, ratio) {
        const baseEffect = {
            brand: [0.6, 0.3, 0.1],
            sales: [0.4, 0.4, 0.2],
            loyalty: [0.5, 0.3, 0.2]
        };

        const effect = baseEffect[focus];
        return effect.map(prob => prob * ratio);
    }

    // 템플릿 로드
    loadTemplate(templateName) {
        const template = this.getTemplateData(templateName);
        if (template) {
            this.updateBehaviorModel(template.behavior);
            this.updateStrategy(template.strategy);
        }
    }

    // 템플릿 데이터 가져오기
    getTemplateData(templateName) {
        const templates = {
            'IT/기술': {
                behavior: {
                    purchaseFrequency: 'high',
                    priceSensitivity: 'medium',
                    brandLoyalty: 'high'
                },
                strategy: {
                    marketingFocus: 'brand',
                    budgetRatio: 0.6
                }
            },
            '유통/서비스': {
                behavior: {
                    purchaseFrequency: 'medium',
                    priceSensitivity: 'high',
                    brandLoyalty: 'medium'
                },
                strategy: {
                    marketingFocus: 'sales',
                    budgetRatio: 0.7
                }
            },
            '제조업': {
                behavior: {
                    purchaseFrequency: 'low',
                    priceSensitivity: 'low',
                    brandLoyalty: 'high'
                },
                strategy: {
                    marketingFocus: 'loyalty',
                    budgetRatio: 0.5
                }
            }
        };
        return templates[templateName];
    }
} 