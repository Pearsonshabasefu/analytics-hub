import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3'
import { useAuthStore } from '../store/authStore'

const FLW_PUBLIC_KEY = import.meta.env.VITE_FLUTTERWAVE_PUBLIC_KEY

/**
 * useFlutterwaveCheckout
 * 
 * Opens the Flutterwave inline payment modal.
 * 
 * @param {object} pkg  - { id, label, ocus, amount, currency? }
 * @param {function} onSuccess - called with tx data after successful payment
 * @param {function} onClose   - called when modal is closed without paying
 */
export function useFlutterwaveCheckout(pkg, onSuccess, onClose) {
  const { user } = useAuthStore()

  const config = {
    public_key: FLW_PUBLIC_KEY,
    tx_ref:     `riq_ocu_${(user?.id || 'guest').slice(0, 8)}_${pkg.id}_${Date.now()}`,
    amount:     pkg.amount,
    currency:   pkg.currency || 'USD',
    payment_options: 'card,banktransfer,ussd,mobilemoney',
    customer: {
      email:        user?.email || '',
      name:         user?.user_metadata?.full_name || user?.email || 'RefineIQ User',
      phone_number: '',
    },
    customizations: {
      title:       'RefineIQ — OCU Top-Up',
      description: `${pkg.label}: ${pkg.ocus} Operations Compute Units`,
      logo:        'https://analytics-hub-l7jy.vercel.app/assets/logo.svg',
    },
    meta: {
      user_id: user?.id || '',
      package: pkg.id,
      ocus:    pkg.ocus,
    },
  }

  const handleFlutterPayment = useFlutterwave(config)

  return () => {
    handleFlutterPayment({
      callback: (data) => {
        closePaymentModal()
        if (data.status === 'successful' || data.status === 'completed') {
          onSuccess?.(data)
        }
      },
      onClose: () => {
        closePaymentModal()
        onClose?.()
      },
    })
  }
}
