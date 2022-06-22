import { Notify, QNotifyCreateOptions, QNotifyUpdateOptions } from 'quasar'

export const showDialog = (
  message: string,
  color = 'primary',
  opts: QNotifyCreateOptions = {}
): ((props?: QNotifyUpdateOptions) => void) => {
  opts.message = message
  opts.color = color
  return Notify.create(opts)
}

export const selectDialog = (
  message: string,
  ...selections: string[]
): Promise<number> =>
  new Promise((resolve) => {
    const opts: QNotifyCreateOptions = {
      message,
      timeout: 0,
      actions: selections.map((x, i) => ({
        label: x,
        handler: () => {
          dismiss()
          resolve(i)
        },
        color: 'info',
        noCaps: true,
      })),
    }
    const dismiss = Notify.create(opts)
  })

export const confirmDialog = async (
  message: string,
  yes = 'Yes',
  no = 'No'
): Promise<boolean> => (await selectDialog(message, yes, no)) === 0
