import Modal from "./Modal";

/* eslint-disable max-lines-per-function */
export default function TermsModal(
  {
    open,
    onClose = () => undefined
  }: {
    open: boolean,
    onClose?: () => void,
  }
) {

  return (
    <Modal
      title="Terms of Use"
      open={open}
      onClose={onClose}
    >
      <h3>1. Content Policy</h3>
      <p>
        The website renders content produced from the Peercoin blockchain which
        is an external data source. The authors, developers, operators and
        copyright holders of this website are not responsible for this content.
      </p>

      <p>
        Content may be censored at the discretion of the website operators.
        Content is not allowed and may be censored where the content:

        <ul>
          <li>Breaches applicable laws.</li>
          <li>Infringes upon intellectual property.</li>
          <li>Constitutes harassment.</li>
          <li>Discloses identifying or personal details of any person.</li>
          <li>Incites violence.</li>
        </ul>
      </p>
      <h3>2. Not a Contract</h3>
      <p>
        Payments made through this website do not constitute a contract with any
        party in any form. Payments made for the purpose of funding pixel
        colours are a mere record on the Peercoin blockchain and payment amounts
        shall become unspendable.
      </p>
      <h3>3. Disclaimer of Warranty</h3>
      <p>
        THE WEBSITE IS PROVIDED "AS IS" and "AS AVAILABLE", WITHOUT WARRANTY OF
        ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
        WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
        NONINFRINGEMENT.
      </p>
      <h3>4. Limitation of Liability</h3>
      <p>
        IN NO EVENT SHALL THE AUTHORS, DEVELOPERS, OPERATORS OR COPYRIGHT
        HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN
        AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
        CONNECTION WITH THE WEBSITE OR THE USE OR OTHER DEALINGS IN THE WEBSITE.
      </p>
      <div className="modal-button-container">
        <button className="secondary" onClick={onClose}>Go back</button>
      </div>
    </Modal>
  );

}
/* eslint-enable */

