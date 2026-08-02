const HOSPITAL_PRICES = {
  None: 0,
  Basic: 90,
  Bronze: 120,
  Silver: 160,
  Gold: 220,
};

const EXTRAS_PRICES = {
  None: 0,
  Basic: 25,
  Standard: 45,
  Premium: 70,
};

const FAMILY_FEE = 30;

function calculateLhcLoading(age, coverHistory, hospitalCover) {
  // No hospital premium means there is nothing to apply loading to.
  if (hospitalCover === "None") {
    return {
      loadingPercentage: 0,
      warning: null,
    };
  }

  if (coverHistory === "Yes") {
    return {
      loadingPercentage: 0,
      warning: null,
    };
  }

  if (coverHistory === "Not sure") {
    return {
      loadingPercentage: 0,
      warning:
        "Cover history is unknown — LHC loading has not been applied. This quote may be inaccurate.",
    };
  }

  if (coverHistory === "No" && age > 30) {
    return {
      loadingPercentage: (age - 30) * 2,
      warning: null,
    };
  }

  return {
    loadingPercentage: 0,
    warning: null,
  };
}

function calculatePremium(quote) {
  const {
    cover_type,
    applicant1_age,
    applicant1_cover_history,
    applicant2_age,
    applicant2_cover_history,
    hospital_cover,
    extras_cover,
    payment_frequency,
    annual_discount = 0,
  } = quote;

  const adultCount = cover_type === "Single" ? 1 : 2;

  const hospitalBasePrice = HOSPITAL_PRICES[hospital_cover];
  const extrasBasePrice = EXTRAS_PRICES[extras_cover];

  const applicant1Lhc = calculateLhcLoading(
    applicant1_age,
    applicant1_cover_history,
    hospital_cover
  );

  const applicant1HospitalCost =
    hospitalBasePrice *
    (1 + applicant1Lhc.loadingPercentage / 100);

  let applicant2Lhc = {
    loadingPercentage: 0,
    warning: null,
  };

  let applicant2HospitalCost = 0;

  if (adultCount === 2) {
    applicant2Lhc = calculateLhcLoading(
      applicant2_age,
      applicant2_cover_history,
      hospital_cover
    );

    applicant2HospitalCost =
      hospitalBasePrice *
      (1 + applicant2Lhc.loadingPercentage / 100);
  }

  const totalHospitalCost =
    applicant1HospitalCost + applicant2HospitalCost;

  const totalExtrasCost = extrasBasePrice * adultCount;

  const familyFee =
    cover_type === "Family" ? FAMILY_FEE : 0;

  const monthlyPremium =
    totalHospitalCost + totalExtrasCost + familyFee;

  const yearlyBeforeDiscount = monthlyPremium * 12;

  const discountPercentage =
    payment_frequency === "Yearly"
      ? Number(annual_discount)
      : 0;

  const discountAmount =
    yearlyBeforeDiscount * (discountPercentage / 100);

  const yearlyPremium =
    yearlyBeforeDiscount - discountAmount;

  const warnings = [];

  if (applicant1Lhc.warning) {
    warnings.push(
      `Applicant 1: ${applicant1Lhc.warning}`
    );
  }

  if (adultCount === 2 && applicant2Lhc.warning) {
    warnings.push(
      `Applicant 2: ${applicant2Lhc.warning}`
    );
  }

  return {
    adult_count: adultCount,

    applicant1_lhc_percentage:
      applicant1Lhc.loadingPercentage,

    applicant2_lhc_percentage:
      applicant2Lhc.loadingPercentage,

    applicant1_hospital_cost:
      Number(applicant1HospitalCost.toFixed(2)),

    applicant2_hospital_cost:
      Number(applicant2HospitalCost.toFixed(2)),

    total_hospital_cost:
      Number(totalHospitalCost.toFixed(2)),

    total_extras_cost:
      Number(totalExtrasCost.toFixed(2)),

    family_fee: familyFee,

    monthly_premium:
      Number(monthlyPremium.toFixed(2)),

    yearly_before_discount:
      Number(yearlyBeforeDiscount.toFixed(2)),

    annual_discount:
      discountPercentage,

    discount_amount:
      Number(discountAmount.toFixed(2)),

    yearly_premium:
      Number(yearlyPremium.toFixed(2)),

    warnings,
  };
}

module.exports = {
  calculatePremium,
};