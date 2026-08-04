import {Link} from "react-router-dom";

const hospitalPrices = [
  { level: "None", price: 0 },
  { level: "Basic", price: 90 },
  { level: "Bronze", price: 120 },
  { level: "Silver", price: 160 },
  { level: "Gold", price: 220 },
];

const extrasCover = [
  { level: "None", price: 0 },
  { level: "Basic", price: 25 },
  { level: "Standard", price: 45 },
  { level: "Premium", price: 70 },
];

function ExplanationPage() {
  const formatCurrency = (value) => 
    Number (value).toLocaleString("en-AU",{
      style: "currency",
      currency: "AUD",
      minimumFractionDigits: 0,
    });

  return (
    <section className="explanation-page">
      <div className="explanation-hero">
        <div>
          <p className="eyebrow">Premium calculation guide</p>
          <h1>How HealthCoverSim Calculates a Quote</h1>
          <p>
            Learn how HealthCoverSim estimates premiums, 
            applies Lifetime Health Cover loading and calculates yearly discounts for educational purposes.
          </p>
        </div>

        <Link to= "/" className="button explanation-back-button">
          Back to Dashboard
        </Link>
      </div>

      <div className="guide-grid">
        <section className="guide-card">
          <div className="guide-card-heading">
            <span className="guide-icon">🏥</span>

            <div>
              <h2>Hospital Cover</h2>
              <p>Monthly base price per adult</p>
            </div>
          </div>

          <div className="pricing-table-container">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Hospital Level</th>
                  <th>Per adult / month</th>
                </tr>
              </thead>

              <tbody>
                {hospitalPrices.map((item) => (
                  <tr key={item.level}>
                    <td>{item.level}</td>
                    <td>{formatCurrency(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="guide-note">
            Hospital cover is calculated separately for each adult.
            Any applicable LHC loading is added to that adult’s
            hospital premium.
          </p>
        </section>

        <section className="guide-card">
          <div className="guide-card-heading">
            <span className="guide-icon">🦷</span>

            <div>
              <h2>Extras Cover</h2>
              <p>Monthly base price per adult</p>
            </div>
          </div>

          <div className="pricing-table-container">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Extras Level</th>
                  <th>Per adult / month</th>
                </tr>
              </thead>

              <tbody>
                {extrasCover.map((item) => (
                  <tr key={item.level}>
                    <td>{item.level}</td>
                    <td>{formatCurrency(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="guide-note">
            Extras cover is calculated by multiplying the selected
            extras price by the number of adults. LHC loading is never
            applied to extras cover.
          </p>
        </section>

        <section className="guide-card">
          <div className="guide-card-heading">
            <span className="guide-icon">💰</span>

            <div>
              <h2>Payment Frequency</h2>
              <p>Monthly base price per adult</p>
            </div>
          </div>

          <div className="pricing-table-container">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th>Extras Level</th>
                  <th>Per adult / month</th>
                </tr>
              </thead>

              <tbody>
                {extrasCover.map((item) => (
                  <tr key={item.level}>
                    <td>{item.level}</td>
                    <td>{formatCurrency(item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="guide-note">
            Extras cover is calculated by multiplying the selected
            extras price by the number of adults. LHC loading is never
            applied to extras cover.
          </p>
        </section>
      </div>

      <section className="guide-card full-width-guide-card">
        <div className="guide-card-heading">
          <span className="guide-icon">💰</span>

          <div>
            <h2>Lifetime Health Cover Loading</h2>
            <p>Applied separately to each applicant</p>
          </div>
        </div>

        <div className="rule-grid">
          <div className="rule-item">
            <span className="rule-label">Cover history: Yes</span>
            <strong>0% loading</strong>
            <p>The applicant previously had hospital cover.</p>
          </div>

          <div className="rule-item">
            <span className="rule-label">Cover history: No</span>
            <strong>(Age - 30)*2%</strong>
            <p>
              Applied only when the applicant is older than 30 and
              hospital cover is selected.
            </p>
          </div>

          <div className="rule-item">
            <span className="rule-label">Cover history: Not sure</span>
            <strong>0% loading</strong>
            <p>
              Loading is not applied, but the system displays a
              warning that the quote may be inaccurate.
            </p>
          </div>

          <div className="rule-item">
            <span className="rule-label">Cover history: None</span>
            <strong>0% loading</strong>
            <p>
              No loading is applied because there is no
              hospital premium to load.
            </p>
          </div>
        </div>

        <div className="lhc-statement">
            Lifetime Health Cover loading applies only to hospital cover.
            It does not apply to extras cover.
        </div>

        <div className="worked-example">
          <h3>LHC example</h3>

          <p>
            A 40-year-old applicant with no previous hospital cover has
            a loading of:
          </p>

          <div className="formula-box">
            (40 - 30) * 2% = 20%
          </div>

          <p>
            If Silver hospital cover costs $160 per month, the loaded
            hospital premium is:
          </p>

          <div className="formula-box">
            $160 + (20% * $160) = $192
          </div>
        </div>
      </section>

      <div className="guide-grid">
        <section className="guide-card">
          <div className="guide-card-heading">
            <span className="guide-icon">💳</span>

            <div>
              <h2>Cover Type</h2>
              <p>How many adults are counted</p>
            </div>
          </div>

          <div className="cover-rule-list">
            <div className="cover-rule-row">
              <span>Single</span>
              <strong>1 adult</strong>
            </div>

            <div className="cover-rule-row">
              <span>Couple</span>
              <strong>2 adults</strong>
            </div>

            <div className="cover-rule-row">
              <span>Family</span>
              <strong>2 adults + $30/month</strong>
            </div>
          </div>

          <p className="guide-note">
            Children are not priced individually. Family cover adds one
            automatic $30 monthly upgrade fee.
          </p>
        </section>

        <section className="guide-card">
          <div className="guide-card-heading">
            <span className="guide-icon">💵</span>

            <div>
              <h2>Payment Frequency</h2>
              <p>Monthly versus Yearly</p>
            </div>
          </div>

          <div className="payment-rule">
            <h3>Monthly Payment</h3>
            <p>
              The monthly premium and yearly premium before discount are shown.
              No annual discount is applied.
            </p>
          </div>

          <div className="payment-rule">
            <h3>Yearly Payment</h3>
            <p>
              The monthly premium is multiplied by 12 and the selected
              annual discount of 0%-10% is applied.
            </p>
          </div>
        </section>
      </div>

      <section className="guide-card full-width-guide-card">
        <div className="guide-card-heading">
          <span className="guide-icon">💳</span>

          <div>
            <h2>Premium Formulas</h2>
            <p>The complete calculation process</p>
          </div>
        </div>

        <div className="formula-steps">
          <div className="formula-step">
            <span>1</span>

            <div>
              <strong>Hospital premium per applicant</strong>
              <p>
                Hospital tier price × (1 + applicant’s LHC loading)
              </p>
            </div>
          </div>

          <div className="formula-step">
            <span>2</span>

            <div>
              <strong>Hospital Total</strong>
              <p>
                Add the hospital premium for each adult included in the
                quote.
              </p>
            </div>
          </div>

          <div className="formula-step">
            <span>3</span>

            <div>
              <strong>Extras Total</strong>
              <p>
                Extras tier price × number of adults
              </p>
            </div>
          </div>

          <div className="formula-step">
            <span>4</span>

            <div>
              <strong>Monthly Premium</strong>
              <p>
                Hospital total + Extras total + Family fee
              </p>
            </div>
          </div>

          <div className="formula-step">
            <span>5</span>
            
            <div>
              <strong>Yearly Premium</strong>
              <p>
                Monthly Premium × 12
              </p>
            </div>
          </div>

          <div className="formula-step">
            <span>6</span>

            <div>
              <strong>Estimated Final Premium</strong>
              <p>
                Yearly before discount × (1 - annual discount)
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="guide-card full-width-guide-card example-card">
        <div className="guide-card-heading">
          <span className="guide-icon">📝</span>

          <div>
            <h2>Worked Example</h2>
            <p>The main example used to verify the application</p>
          </div>
        </div>

        <div className="example-inputs">
          <div>
            <span>Cover type</span>
            <strong>Family</strong>
          </div>

          <div>
            <span>Applicant 1</span>
            <strong>Age 40, history No</strong>
          </div>

          <div>
            <span>Applicant 2</span>
            <strong>Age 35, history Yes</strong>
          </div>

          <div>
            <span>Hospital</span>
            <strong>Silver</strong>
          </div>

          <div>
            <span>Extras</span>
            <strong>Standard</strong>
          </div>

          <div>
            <span>Payment</span>
            <strong>Yearly, 5% discount</strong>
          </div>
        </div>

        <div className="example-results">
          <div className="example-result-row">
            <span>Applicant 1 hospital</span>
            <strong>$160 × 1.20 = $192</strong>
          </div>

          <div className="example-result-row">
            <span>Applicant 2 hospital</span>
            <strong>$160</strong>
          </div>

          <div className="example-result-row">
            <span>Hospital Total</span>
            <strong>$352</strong>
          </div>

          <div className="example-result-row">
            <span>Extras Total</span>
            <strong>$90</strong>
          </div>

          <div className="example-result-row">
            <span>Family Fee</span>
            <strong>$30</strong>
          </div>

          <div className="example-result-row highlighted-result">
            <span>Monthly Premium</span>
            <strong>$472</strong>
          </div>

          <div className="example-result-row">
            <span>Yearly before Discount</span>
            <strong>$472 × 12 = $5,664</strong>
          </div>

          <div className="example-result-row final-result">
            <span>Estimated Final Premium</span>
            <strong>$5,664 × 0.95 = $5,380.80</strong>
          </div>
        </div>
      </section>

      <section className="guide-card full-width-guide-card">
        <div className="guide-card-heading">
          <span className="guide-icon">🛡️</span>

          <div>
            <h2>Validation and Important Notes</h2>
            <p>Rules that prevent misleading quotations</p>
          </div>
        </div>

        <ul className="validation-list">
          <li>Customer name and all cover selections are required.</li>
          <li>Applicant ages must be whole numbers from 18 to 100.</li>
          <li>
            Applicant 2 age and cover history are required for Couple
            and Family cover.
          </li>
          <li>
            Annual-payment discount must be between 0% and 10%.
          </li>
          <li>
            Annual discount is only applied when Yearly payment is
            selected.
          </li>
          <li>
            A “Not sure” cover history does not receive an automatic
            LHC loading and produces an uncertainty warning.
          </li>
          <li>
            This application is a learning simulator and does not
            provide financial advice.
          </li>
        </ul>
      </section>

      <div className="guide-disclaimer">
        <strong>Disclaimer</strong>
          <p>
            HealthCoverSim is an educational simulator.
            Premiums displayed by the system are estimates only and
            should not be interpreted as financial advice.
          </p>
      </div>    

      <div className="explanation-actions">
        <Link to="/" className="button secondary-button">
          Dashboard
        </Link>

        <Link to="/quotes/new" className="button primary-button">
          Create Quote
        </Link>
      </div>
    </section>
  );
}

export default ExplanationPage;