class RemoveListNameToTimers < ActiveRecord::Migration[5.2]
  def change
    remove_column :timers, :list_name
  end
end
