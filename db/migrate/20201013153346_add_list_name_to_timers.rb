class AddListNameToTimers < ActiveRecord::Migration[5.2]
  def change
    add_column :timers, :list_name, :string
  end
end
