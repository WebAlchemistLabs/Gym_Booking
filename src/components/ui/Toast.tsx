import { CheckCircle, XCircle, Info, X } from 'lucide-react'
import { useToast } from '../../context/ToastContext'
import { cn } from '../../utils'
import styles from './Toast.module.css'

export default function ToastContainer() {
  const { toasts, dismiss } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className={styles.toastContainer}>
      {toasts.map(t => (
        <div
          key={t.id}
          className={cn(
            styles.toast,
            t.type === 'success' && styles.toastSuccess,
            t.type === 'error' && styles.toastError,
            t.type === 'info' && styles.toastInfo,
          )}
        >
          <span className={styles.toastIcon}>
            {t.type === 'success' && <CheckCircle size={15} />}
            {t.type === 'error' && <XCircle size={15} />}
            {t.type === 'info' && <Info size={15} />}
          </span>
          <span className={styles.toastMessage}>{t.message}</span>
          <button className={styles.toastDismiss} onClick={() => dismiss(t.id)} aria-label="Dismiss">
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  )
}
